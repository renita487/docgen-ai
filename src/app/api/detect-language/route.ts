import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ language: 'unknown' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a programming language detector. Respond with ONLY the language name in lowercase (e.g., python, javascript, typescript, rust, go, java, csharp, ruby, php, swift, kotlin, cpp, sql, html, css, bash). Nothing else.' },
          { role: 'user', content: `What programming language is this?\n\n${code.slice(0, 2000)}` },
        ],
        temperature: 0,
        max_tokens: 20,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ language: 'unknown' });
    }

    const data = await response.json();
    const language = data.choices?.[0]?.message?.content?.trim().toLowerCase() || 'unknown';

    return NextResponse.json({ language });
  } catch {
    return NextResponse.json({ language: 'unknown' });
  }
}