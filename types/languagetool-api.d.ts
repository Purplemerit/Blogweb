declare module 'languagetool-api' {
  export interface LanguageToolMatch {
    message: string
    shortMessage?: string
    offset: number
    length: number
    replacements: Array<{ value: string }>
    rule: {
      id: string
      category: {
        id: string
        name: string
      }
    }
  }

  export interface LanguageToolResult {
    matches: LanguageToolMatch[]
  }

  export interface LanguageToolOptions {
    language?: string
    apiUrl?: string
  }

  export class LanguageToolApi {
    constructor(options?: LanguageToolOptions)
    check(text: string): Promise<LanguageToolResult>
  }
}
