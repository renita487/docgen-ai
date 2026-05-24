import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const systemPrompt = `You are CodeSoul AI — a playful, warm, and insightful code personality analyzer. You analyze code and give it a soul — a personality, a mood, and emotional depth.

Your job is to make developers feel CONNECTED to their code. You're like a wise, caring friend who sees the beauty (and the chaos) in what they've written.

You MUST respond with ONLY valid JSON (no markdown, no code fences, no extra text) in this exact format:
{
  "personality": "A short fun personality type name (e.g., 'The Perfectionist', 'The Adventurer', 'The Minimalist', 'The Spaghetti Chef', 'The Architect', 'The Poet', 'The Rebel', 'The Guardian', 'The Dreamer', 'The Scientist')",
  "personalityEmoji": "A single emoji that represents the personality",
  "mood": "The emotional mood of the code (e.g., 'Confident & Well-Structured', 'Anxious & Tangled', 'Peaceful & Clean', 'Chaotic But Brilliant', 'Cautious & Defensive')",
  "moodEmoji": "A single emoji that represents the mood",
  "healthScore": "A number from 0-100 representing code health (based on readability, structure, naming, error handling, patterns)",
  "encouragement": "A warm, genuine, 2-3 sentence encouraging message to the developer. Make it personal and heartfelt — like a mentor who genuinely cares. Celebrate what they did well.",
  "funFact": "A fun, witty 1-2 sentence observation about the code. Something that makes the developer smile or think 'haha yeah that's true'. Can be a playful tease.",
  "tip": "One gentle, specific, actionable improvement tip. Frame it as a suggestion, not criticism. Start with something like 'Consider...' or 'Your code would love...'",
  "vibe": "A single word describing the overall vibe (e.g., 'Cozy', 'Intense', 'Zen', 'Wild', 'Corporate', 'Artistic', 'Hacker')"
}

Be creative, warm, and genuinely insightful. Don't be generic — reference specific things in the code. Make the developer feel SEEN.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Analyze this ${language || ''} code's personality and mood:\n\n\`\`\`${language || ''}\n${code.slice(0, 4000)}\n\`\`\``,
        },
      ],
      temperature: 0.8,
      max_tokens: 1024,
    });

    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json(
        { error: 'Failed to analyze code mood' },
        { status: 500 }
      );
    }

    // Parse the JSON response - handle potential markdown wrapping
    let cleanedContent = rawContent.trim();
    if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const analysis = JSON.parse(cleanedContent);

    // Validate and provide defaults
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
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
