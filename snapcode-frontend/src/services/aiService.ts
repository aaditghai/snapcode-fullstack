// Service for backend integration

export interface GeneratedCode {
  html: string;
  css: string;
  js: string;
}

export class AIService {
  private readonly API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8002';

  async generateCodeFromDescription(description: string): Promise<GeneratedCode> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // The backend returns { code: string }, so we need to parse the HTML/CSS/JS from it
      if (!result.code) {
        throw new Error('Invalid response format from API - missing code field');
      }

      // Parse the generated code to extract HTML, CSS, and JS
      const { html, css, js } = this.parseGeneratedCode(result.code);

      return {
        html,
        css,
        js
      };
    } catch (error) {
      console.error('Error calling AI service:', error);
      throw new Error(
        error instanceof Error 
          ? `Failed to generate code: ${error.message}`
          : 'Failed to generate code from description'
      );
    }
  }

  private parseGeneratedCode(code: string): { html: string; css: string; js: string } {
    // Default values
    let html = '';
    let css = '';
    let js = '';

    // Try to extract HTML (content between <!DOCTYPE html> or <html> tags)
    const htmlMatch = code.match(/(<!DOCTYPE html>[\s\S]*?<\/html>|<html[\s\S]*?<\/html>)/i);
    if (htmlMatch) {
      html = htmlMatch[1];
    } else {
      // If no HTML tags found, assume the entire code is HTML
      html = code;
    }

    // Try to extract CSS (content between <style> tags)
    const cssMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (cssMatch) {
      css = cssMatch.map(match => {
        const content = match.replace(/<style[^>]*>([\s\S]*?)<\/style>/i, '$1');
        return content;
      }).join('\n');
    }

    // Try to extract JavaScript (content between <script> tags)
    const jsMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    if (jsMatch) {
      js = jsMatch.map(match => {
        const content = match.replace(/<script[^>]*>([\s\S]*?)<\/script>/i, '$1');
        return content;
      }).join('\n');
    }

    return { html, css, js };
  }
}

export const aiService = new AIService();