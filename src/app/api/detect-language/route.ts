import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a programming language detector. Respond with ONLY the programming language name in lowercase (e.g., python, javascript, typescript, rust, go, java, csharp, ruby, php, swift, kotlin, cpp, c, sql, html, css, bash). Nothing else.',
        },
        {
          role: 'user',
          content: `What programming language is this code written in?\n\n${code.slice(0, 2000)}`,
        },
      ],
      temperature: 0,
      max_tokens: 20,
    });

    const language = completion.choices[0]?.message?.content?.trim().toLowerCase() || 'unknown';

    return NextResponse.json({ language });
  } catch {
    return NextResponse.json({ language: 'unknown' });
  }
}
