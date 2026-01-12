import { GoogleGenAI } from '@google/genai';

// Check if API key is available
if (!process.env.GEMINI_API_KEY) {
  console.error('⚠️ GEMINI_API_KEY is not set in environment variables');
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export class GeminiService {
  async generateBlogContent(params: {
    title: string;
    keywords?: string[];
    toneOfVoice?: string;
    contentFramework?: string;
    wordCount?: number;
  }): Promise<string> {
    const {
      title,
      keywords = [],
      toneOfVoice = 'professional',
      contentFramework = 'standard',
      wordCount = 1000,
    } = params;

    const prompt = this.buildContentPrompt({
      title,
      keywords,
      toneOfVoice,
      contentFramework,
      wordCount,
    });

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file.');
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (!response.text) {
        throw new Error('No content generated from AI');
      }

      return response.text;
    } catch (error: any) {
      console.error('Gemini API Error:', error);

      // Provide more specific error messages
      if (error.message?.includes('API key')) {
        throw new Error('Invalid Gemini API key. Please check your GEMINI_API_KEY in .env file.');
      }

      throw new Error(error.message || 'Failed to generate content with AI');
    }
  }

  async improveParagraph(paragraph: string, instruction: string): Promise<string> {
    const prompt = `Improve the following paragraph based on this instruction: "${instruction}"\n\nParagraph:\n${paragraph}\n\nProvide only the improved version without explanations.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (!response.text) {
        throw new Error('No content generated from AI');
      }

      return response.text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to improve paragraph');
    }
  }

  async generateOutline(title: string, sections: number = 5): Promise<string[]> {
    const prompt = `Create a detailed blog post outline for the following title: "${title}"\n\nGenerate ${sections} main sections with brief descriptions. Format each section as: "Section Title - Brief description"\n\nProvide only the outline, no additional text.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (!response.text) {
        throw new Error('No content generated from AI');
      }

      return response.text.split('\n').filter(line => line.trim().length > 0);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate outline');
    }
  }

  async generateMetaDescription(content: string, maxLength: number = 160): Promise<string> {
    const prompt = `Write a compelling meta description (max ${maxLength} characters) for the following blog post content:\n\n${content.substring(0, 1000)}\n\nProvide only the meta description, no additional text.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (!response.text) {
        throw new Error('No content generated from AI');
      }

      return response.text.trim();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate meta description');
    }
  }

  async generateTitleSuggestions(topic: string, count: number = 5): Promise<string[]> {
    const prompt = `Generate ${count} creative and engaging blog post titles for the topic: "${topic}"\n\nProvide only the titles, one per line, numbered.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (!response.text) {
        throw new Error('No content generated from AI');
      }

      return response.text
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, count);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate title suggestions');
    }
  }

  async summarizeContent(content: string, maxWords: number = 100): Promise<string> {
    const prompt = `Summarize the following content in approximately ${maxWords} words:\n\n${content}\n\nProvide only the summary, no additional text.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (!response.text) {
        throw new Error('No content generated from AI');
      }

      return response.text.trim();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to summarize content');
    }
  }

  private buildContentPrompt(params: {
    title: string;
    keywords: string[];
    toneOfVoice: string;
    contentFramework: string;
    wordCount: number;
  }): string {
    const { title, keywords, toneOfVoice, contentFramework, wordCount } = params;

    let frameworkInstructions = '';

    switch (contentFramework) {
      case 'problem-agitate-solve':
        frameworkInstructions = `
Follow the Problem-Agitate-Solve framework:
1. Problem: Clearly define the problem your audience faces
2. Agitate: Amplify the problem and its consequences
3. Solve: Present your solution with clear benefits`;
        break;
      case 'how-to':
        frameworkInstructions = `
Follow the How-To framework:
1. Introduction: State what will be learned
2. Step-by-step instructions with clear explanations
3. Tips and best practices
4. Conclusion with key takeaways`;
        break;
      case 'listicle':
        frameworkInstructions = `
Follow the Listicle framework:
1. Engaging introduction
2. Numbered list items with detailed explanations
3. Use subheadings for each point
4. Conclusion that summarizes the list`;
        break;
      default:
        frameworkInstructions = `
Follow a standard blog structure:
1. Compelling introduction
2. Main content with clear subheadings
3. Supporting examples and data
4. Strong conclusion with call-to-action`;
    }

    const keywordText = keywords.length > 0
      ? `\nInclude these keywords naturally: ${keywords.join(', ')}`
      : '';

    return `Write a comprehensive blog post with the following specifications:

Title: ${title}
Tone: ${toneOfVoice}
Target Word Count: ${wordCount} words${keywordText}

${frameworkInstructions}

Requirements:
- Write in ${toneOfVoice} tone
- Use markdown formatting (headers, bold, italic, lists)
- Include relevant examples and explanations
- Make it engaging and easy to read
- Add a compelling introduction and strong conclusion
- Use H2 and H3 headings to structure the content

Write the complete blog post now:`;
  }
}

export const geminiService = new GeminiService();
