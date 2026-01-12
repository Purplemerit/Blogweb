/**
 * AI Image Generation API
 * Generates images using AI (Stability AI or OpenAI DALL-E)
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import prisma from '@/lib/prisma';
import { CloudinaryService } from '@/lib/services/cloudinary.service';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No access token provided' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(accessToken);

    const body = await request.json();
    const { prompt, articleId, alt, caption, provider = 'stability', size = '1024x1024' } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let imageUrl: string;
    let width = 1024;
    let height = 1024;

    // Parse size
    if (size) {
      const [w, h] = size.split('x').map((n: string) => parseInt(n));
      width = w;
      height = h;
    }

    // Generate image based on provider
    if (provider === 'openai' || provider === 'dalle') {
      // OpenAI DALL-E
      const openaiApiKey = process.env.OPENAI_API_KEY;

      if (!openaiApiKey) {
        return NextResponse.json(
          { success: false, error: 'OpenAI API key not configured' },
          { status: 500 }
        );
      }

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: size || '1024x1024',
          quality: 'standard',
          response_format: 'url',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return NextResponse.json(
          { success: false, error: error.error?.message || 'Failed to generate image with DALL-E' },
          { status: response.status }
        );
      }

      const data = await response.json();
      imageUrl = data.data[0].url;
    } else {
      // Stability AI
      const stabilityApiKey = process.env.STABILITY_API_KEY;

      if (!stabilityApiKey) {
        return NextResponse.json(
          { success: false, error: 'Stability AI API key not configured' },
          { status: 500 }
        );
      }

      const response = await fetch(
        'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${stabilityApiKey}`,
          },
          body: JSON.stringify({
            text_prompts: [
              {
                text: prompt,
                weight: 1,
              },
            ],
            cfg_scale: 7,
            height: height,
            width: width,
            steps: 30,
            samples: 1,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return NextResponse.json(
          {
            success: false,
            error: error.message || 'Failed to generate image with Stability AI',
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      const imageBase64 = data.artifacts[0].base64;

      // Convert base64 to buffer
      const buffer = Buffer.from(imageBase64, 'base64');

      // Upload to Cloudinary
      const uploadResult = await CloudinaryService.uploadImage(buffer, {
        folder: 'blogweb/ai-generated',
        filename: `ai_${Date.now()}`,
      });

      if (!uploadResult.success || !uploadResult.data) {
        return NextResponse.json(
          { success: false, error: 'Failed to upload generated image' },
          { status: 500 }
        );
      }

      imageUrl = uploadResult.data.secureUrl;
      width = uploadResult.data.width;
      height = uploadResult.data.height;
    }

    // If using OpenAI, upload to Cloudinary for consistency
    if (provider === 'openai' || provider === 'dalle') {
      const uploadResult = await CloudinaryService.uploadFromUrl(imageUrl, {
        folder: 'blogweb/ai-generated',
        filename: `ai_dalle_${Date.now()}`,
      });

      if (uploadResult.success && uploadResult.data) {
        imageUrl = uploadResult.data.secureUrl;
        width = uploadResult.data.width;
        height = uploadResult.data.height;
      }
    }

    // Save to database
    const image = await prisma.image.create({
      data: {
        userId: currentUser.id,
        articleId: articleId || null,
        url: imageUrl,
        thumbnailUrl: imageUrl,
        filename: `ai_generated_${Date.now()}.png`,
        mimeType: 'image/png',
        size: 0, // We don't know the size yet
        width,
        height,
        alt: alt || prompt.substring(0, 100),
        caption: caption || `AI Generated: ${prompt.substring(0, 50)}...`,
        source: 'AI_GENERATED',
      },
    });

    // Update usage stats
    await prisma.usageStats.upsert({
      where: { userId: currentUser.id },
      update: {
        imagesGeneratedThisMonth: { increment: 1 },
      },
      create: {
        userId: currentUser.id,
        imagesGeneratedThisMonth: 1,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Image generated successfully',
      data: image,
    });
  } catch (error: any) {
    console.error('AI image generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate image',
      },
      { status: 500 }
    );
  }
}
