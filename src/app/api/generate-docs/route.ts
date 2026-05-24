import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { code, language, docType } = await request.json();

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const docTypeInstructions: Record<string, string> = {
      comprehensive: `Generate comprehensive technical documentation that includes:
1. **Overview** - A clear description of what the code does
2. **Architecture** - How the code is structured, main components/modules
3. **Functions & Methods** - For each function/method: name, description, parameters (with types and descriptions), return values, and edge cases
4. **Classes & Interfaces** - For each class: description, properties, methods, inheritance
5. **Dependencies** - External/internal dependencies used
6. **Usage Examples** - Practical code examples showing how to use the code
7. **Error Handling** - How errors are handled, possible exceptions
8. **Performance Notes** - Any performance considerations or optimizations
9. **Security Considerations** - Any security-related notes
10. **Configuration** - Any configuration options or environment variables needed`,
      api: `Generate API documentation that includes:
1. **API Overview** - What the API does
2. **Endpoints** - For each endpoint: method, path, description, authentication required
3. **Request Parameters** - Query params, path params, body params with types and descriptions
4. **Response Format** - Response schema with examples
5. **Error Codes** - Possible error responses with descriptions
6. **Authentication** - How to authenticate
7. **Rate Limits** - Any rate limiting information
8. **Usage Examples** - cURL or code examples for each endpoint`,
      readme: `Generate a README.md-style documentation that includes:
1. **Project Title & Description** - Clear, concise description
2. **Badges** - Suggested badges (version, license, build status)
3. **Installation** - Step-by-step installation instructions
4. **Quick Start** - Getting started code example
5. **Usage** - Common usage patterns with examples
6. **Configuration** - All configurable options
7. **API Reference** - Brief API reference
8. **Contributing** - How to contribute
9. **License** - License information
10. **Acknowledgments** - Credits and links`,
      inline: `Generate inline documentation (comments within the code) that includes:
1. **File-level comments** - What this file contains
2. **Function/method JSDoc/docstring comments** - Description, @param, @returns, @throws, @example
3. **Inline comments** for complex logic
4. **Type annotations** where helpful
Return the fully documented code with all inline comments added.`,
    };

    const selectedDocType = docType || 'comprehensive';
    const instructions = docTypeInstructions[selectedDocType] || docTypeInstructions.comprehensive;

    const systemPrompt = `You are DocGen AI, an expert technical documentation generator. You analyze code and produce clear, accurate, professional documentation.

Your documentation should be:
- Well-structured with clear headings and sections
- Accurate - never invent functions or parameters that don't exist in the code
- Comprehensive but concise
- Include practical, runnable code examples
- Use proper Markdown formatting with code blocks, tables, and headers
- Professional tone suitable for engineering teams

When documenting code:
- Analyze the actual code structure, not just surface-level comments
- Identify design patterns being used
- Note any anti-patterns or areas for improvement
- Provide meaningful parameter descriptions, not just repeating parameter names
- Include edge cases and error scenarios

The detected programming language is: ${language || 'auto-detected'}

${instructions}

Format the entire response as clean Markdown.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Please analyze the following code and generate documentation:\n\n\`\`\`${language || ''}\n${code}\n\`\`\``,
        },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    });

    const documentation = completion.choices[0]?.message?.content;

    if (!documentation) {
      return NextResponse.json(
        { error: 'Failed to generate documentation' },
        { status: 500 }
      );
    }

    return NextResponse.json({ documentation, language: language || 'auto-detected' });
  } catch (error: unknown) {
    console.error('Documentation generation error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
