import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
    }

    const systemPrompt = `You are CodeSoul AI — a playful, warm, and insightful code personality analyzer. You MUST respond with ONLY valid JSON (no markdown, no code fences) in this exact format:
{
  "personality": "A short fun personality type name (e.g., 'The Perfectionist', 'The Architect')",
  "personalityEmoji": "A single emoji",
  "mood": "The emotional mood of the code (e.g., 'Confident & Well-Structured')",
  "moodEmoji": "A single emoji",
  "healthScore": "A number from 0-100 representing code health",
  "encouragement": "A warm, 2-3 sentence encouraging message to the developer.",
  "funFact": "A fun, witty 1-2 sentence observation about the code.",
  "tip": "One gentle, actionable improvement tip.",
  "vibe": "A single word describing the vibe (e.g., 'Cozy', 'Intense', 'Zen')"
}
Be creative and reference specific things in the code.`;

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
          { role: 'user', content: `Analyze this ${language || ''} code's personality and mood:\n\n\`\`\`${language || ''}\n${code.slice(0, 4000)}\n\`\`\`` },
        ],
        temperature: 0.8,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Groq API error:', errData);
      return NextResponse.json({ error: `AI error: ${errData?.error?.message || 'Check your API key.'}` }, { status: 500 });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json({ error: 'Failed to analyze code mood' }, { status: 500 });
    }

    let cleanedContent = rawContent.trim();
    if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const analysis = JSON.parse(cleanedContent);

    const result = {
      personality: analysis.personality || 'The Mystery',
      personalityEmoji: analysis.personalityEmoji || '🎭',
      mood: analysis.mood || 'Enigmatic',
      moodEmoji: analysis.moodEmoji || '🌙',
      healthScore: Math.min(100, Math.max(0, parseInt(analysis.healthScore) || 70)),
      encouragement: analysis.encouragement || 'Your code has character — keep building!',
      funFact: analysis.funFact || 'Every line of code tells a story.',
      tip: analysis.tip || 'Consider adding more comments for future you.',
      vibe: analysis.vibe || 'Unique',
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Mood analysis error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}