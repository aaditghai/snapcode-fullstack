// Service for backend integration

export interface GeneratedCode {
  html: string;
  css: string;
  js: string;
}

function normalizeApiBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export class AIService {
  private readonly API_BASE_URL = normalizeApiBaseUrl(
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8002"
  );

  async generateCodeFromDescription(description: string): Promise<GeneratedCode> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        let detail = `HTTP error! status: ${response.status}`;
        try {
          const errBody = await response.json();
          if (errBody?.detail) {
            detail =
              typeof errBody.detail === "string"
                ? errBody.detail
                : JSON.stringify(errBody.detail);
          }
        } catch {
          // ignore JSON parse failures; keep status-based message
        }
        throw new Error(detail);
      }

      const result = await response.json();

      if (!result || typeof result.code !== "string" || !result.code.trim()) {
        throw new Error("Invalid response format from API - missing code field");
      }

      const { html, css, js } = this.parseGeneratedCode(result.code);

      return {
        html,
        css,
        js,
      };
    } catch (error) {
      console.error("Error calling AI service:", error);
      throw new Error(
        error instanceof Error
          ? `Failed to generate code: ${error.message}`
          : "Failed to generate code from description"
      );
    }
  }

  private parseGeneratedCode(code: string): { html: string; css: string; js: string } {
    let html = "";
    let css = "";
    let js = "";

    const htmlMatch = code.match(/(<!DOCTYPE html>[\s\S]*?<\/html>|<html[\s\S]*?<\/html>)/i);
    if (htmlMatch) {
      html = htmlMatch[1];
    } else {
      html = code;
    }

    const cssMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (cssMatch) {
      css = cssMatch
        .map((match) => match.replace(/<style[^>]*>([\s\S]*?)<\/style>/i, "$1"))
        .join("\n");
    }

    const jsMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    if (jsMatch) {
      js = jsMatch
        .map((match) => match.replace(/<script[^>]*>([\s\S]*?)<\/script>/i, "$1"))
        .join("\n");
    }

    return { html, css, js };
  }
}

export const aiService = new AIService();
