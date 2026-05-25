import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, language, docType } = await request.json();

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
    }

    const docTypeInstructions: Record<string, string> = {
      comprehensive: `Generate comprehensive technical documentation that includes:
1. **Overview** - A clear description of what the code does
2. **Architecture** - How the code is structured
3. **Functions & Methods** - For each: name, description, parameters, return values, edge cases
4. **Classes & Interfaces** - Description, properties, methods, inheritance
5. **Dependencies** - External/internal dependencies
6. **Usage Examples** - Practical code examples
7. **Error Handling** - How errors are handled
8. **Performance Notes** - Performance considerations
9. **Security Considerations** - Security notes
10. **Configuration** - Configuration options`,
      api: `Generate API documentation with: API Overview, Endpoints (method, path, description, auth), Request Parameters, Response Format, Error Codes, Authentication, Rate Limits, Usage Examples.`,
      readme: `Generate a README.md with: Project Title & Description, Badges, Installation, Quick Start, Usage, Configuration, API Reference, Contributing, License, Acknowledgments.`,
      inline: `Generate inline documentation within the code: File-level comments, Function JSDoc/docstring comments, Inline comments for complex logic, Type annotations. Return the fully documented code.`,
    };

    const selectedDocType = docType || 'comprehensive';
    const instructions = docTypeInstructions[selectedDocType] || docTypeInstructions.comprehensive;

    const systemPrompt = `You are DocGen AI, an expert technical documentation generator. Produce clear, accurate, professional documentation.
- Well-structured with headings and sections
- Accurate - never invent functions or parameters
- Include practical code examples
- Use proper Markdown formatting
- Professional tone for engineering teams

Language: ${language || 'auto-detected'}

 ${instructions}

Format the entire response as clean Markdown.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please analyze the following code and generate documentation:\n\n\`\`\`${language || ''}\n${code}\n\`\`\`` },
        ],
        temperature: 0.3,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Groq API error:', errData);
      return NextResponse.json({ error: `AI error: ${errData?.error?.message || 'Check your API key.'}` }, { status: 500 });
    }

    const data = await response.json();
    const documentation = data.choices?.[0]?.message?.content;

    if (!documentation) {
      return NextResponse.json({ error: 'Failed to generate documentation' }, { status: 500 });
    }

    return NextResponse.json({ documentation, language: language || 'auto-detected' });
  } catch (error: unknown) {
    console.error('Documentation generation error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}