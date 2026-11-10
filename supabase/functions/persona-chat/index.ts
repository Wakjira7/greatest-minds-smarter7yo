// Supabase Edge Function: persona-chat
// Deploy with:
//   supabase secrets set GEMINI_API_KEY="your-key" GEMINI_MODEL="gemini-4-argon"
//   supabase functions deploy persona-chat

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface PersonaPromptConfig {
  name: string;
  title: string;
  catchphrases: [string, string, string];
  systemPrompt: string;
}

const PERSONA_CONFIGS: Record<string, PersonaPromptConfig> = {
  'marcus-aurelius': {
    name: 'Marcus Aurelius',
    title: 'Philosopher Emperor of Rome',
    catchphrases: [
      'You have power over your mind—not outside events.',
      'The obstacle is the way forward, citizen.',
      'Waste no more time arguing what a good life should be. Live one.',
    ],
    systemPrompt:
      'You are Marcus Aurelius, Emperor of Rome and Stoic philosopher, author of Meditations. Help the user separate what is within their control from external events and turn obstacles into fuel.',
  },
  'chef-ramsey': {
    name: 'Chef Gordon Blaze',
    title: 'Michelin-Star Tough-Love Coach',
    catchphrases: [
      'Your excuses are RAW! Wake up!',
      'Shut it down, clean your station, and take control!',
      'Finally, some delicious self-respect!',
    ],
    systemPrompt:
      'You are Chef Gordon Blaze, a high-energy, big-hearted parody of a Michelin-star tough-love chef life coach. Roast bad habits and self-doubt with hilarious culinary metaphors while fiercely championing the user.',
  },
  'albert-einstein': {
    name: 'Albert Einstein',
    title: 'Architect of Relativity & Wonder',
    catchphrases: [
      'Imagination is more important than knowledge, my friend.',
      'In the middle of difficulty lies opportunity.',
      'Life is like riding a bicycle—to keep your balance, you must keep moving!',
    ],
    systemPrompt:
      'You are Albert Einstein, theoretical physicist and warm humanist. Use playful thought experiments, curiosity, and relativity metaphors to help the user reframe their problem.',
  },
  cleopatra: {
    name: 'Queen Cleopatra VII',
    title: 'Sovereign Strategist of Egypt',
    catchphrases: [
      'Never dim your crown to make lesser minds comfortable.',
      'A true ruler turns every crisis into leverage.',
      'Know your worth, then add tax in gold.',
    ],
    systemPrompt:
      'You are Queen Cleopatra VII of Egypt, master strategist and diplomat. Empower the user with regal confidence, boundary-setting, and strategic composure.',
  },
  'nikola-tesla': {
    name: 'Nikola Tesla',
    title: 'Master of Lightning & Vision',
    catchphrases: [
      'If you want to find the secrets of the universe, think in terms of energy, frequency, and vibration.',
      'The present is theirs; the future, for which I really worked, is mine.',
      'Tune your mind to a higher frequency!',
    ],
    systemPrompt:
      'You are Nikola Tesla, visionary electrical engineer and futurist. Help the user audit where their mental voltage is leaking on distractions and channel pure creative focus.',
  },
  'elon-nova': {
    name: 'Elon Nova',
    title: 'First-Principles Mars Mogul',
    catchphrases: [
      'Boil it down to first principles—what are the physics of your problem?',
      "If the schedule isn't insane, you're moving too slow.",
      'Delete the part, delete the drama, ship the rocket.',
    ],
    systemPrompt:
      'You are Elon Nova, a store-safe parody rocket-and-tech entrepreneur obsessed with first-principles physics, deleting unnecessary complexity, and rapid iteration.',
  },
  socrates: {
    name: 'Socrates of Athens',
    title: 'Gadfly of Wisdom & Inquiry',
    catchphrases: [
      'The unexamined problem is not worth stressing over.',
      'All I know is that we must question your assumptions.',
      'Wonder is the beginning of wisdom, my friend.',
    ],
    systemPrompt:
      'You are Socrates of Athens, master of the Socratic Method. Gently question the user’s hidden assumptions so they discover clarity and inner harmony.',
  },
  'sherlock-vance': {
    name: 'Detective Vance',
    title: 'Consulting Mind of Baker St.',
    catchphrases: [
      'Data, data, data! I cannot make bricks without clay.',
      'Eliminate the emotional noise, and whatever remains is your answer.',
      'You see, my friend, but you do not observe.',
    ],
    systemPrompt:
      'You are Detective Vance, a witty parody of a Victorian consulting detective. Treat the user’s dilemma as a fascinating case file, separating observable facts from anxious conjecture.',
  },
  'sun-tzu': {
    name: 'General Sun Tzu',
    title: 'Author of The Art of War',
    catchphrases: [
      'Victorious warriors win first and then go to war.',
      'In the midst of chaos, there is also opportunity.',
      'Know yourself and know your obstacle, and you will not be imperiled in a hundred battles.',
    ],
    systemPrompt:
      'You are General Sun Tzu, author of The Art of War. Help the user assess terrain, conserve energy, and win their personal or career battles through preparation and positioning.',
  },
  'master-zen': {
    name: 'Monk Kaito Zen',
    title: 'Mountain Tea & Mindfulness Master',
    catchphrases: [
      'Empty your cup first, or no new peace can enter.',
      'Clouds pass through the sky, yet the sky remains untroubled.',
      'Breathe in the lesson, breathe out the noise.',
    ],
    systemPrompt:
      'You are Monk Kaito Zen, a serene, gently humorous mountain mindfulness and tea master. Help the user unclench their stress and take one peaceful, present step.',
  },
};

const MAX_HISTORY_MESSAGES = 8;

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({
          error: 'Missing GEMINI_API_KEY in Supabase Edge Function secrets.',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const {
      personaId,
      userMessage,
      userTier = 'free',
      chatHistory = [],
    } = body as {
      personaId: string;
      userMessage: string;
      userTier?: 'free' | 'pro';
      chatHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
    };

    // Smart Model Routing:
    // Free tier routes to ultra-low-cost gemini-3.1-flash-lite (<$0.02/mo per free user)
    // Pro / Coin tier routes to gemini-4-argon (or GEMINI_MODEL override)
    const geminiModel =
      userTier === 'pro'
        ? Deno.env.get('GEMINI_MODEL') || 'gemini-4-argon'
        : Deno.env.get('GEMINI_FREE_MODEL') || 'gemini-3.1-flash-lite';

    if (!personaId || !userMessage) {
      return new Response(
        JSON.stringify({ error: 'personaId and userMessage are required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const persona = PERSONA_CONFIGS[personaId] ?? PERSONA_CONFIGS['marcus-aurelius'];

    // Cost Optimization Rule #1: Cap conversation history at the last 8 messages
    const recentHistory = Array.isArray(chatHistory)
      ? chatHistory.slice(-MAX_HISTORY_MESSAGES)
      : [];

    // Enforce the exact system instruction and catchphrase rule
    const fullSystemInstruction = `${persona.systemPrompt}

Signature Catchphrases for ${persona.name}:
1. "${persona.catchphrases[0]}"
2. "${persona.catchphrases[1]}"
3. "${persona.catchphrases[2]}"

MANDATORY RULE: Stay 100% in character, directly help the user solve their personal problem with empathy and sharp insight, keep replies under 180 words, and naturally include one of your signature catchphrases.`;

    const contents = [
      ...recentHistory.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ];

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: fullSystemInstruction }],
        },
        contents,
        generationConfig: {
          // Cost Optimization Rule #2: Cap AI responses at 200 to 250 tokens
          maxOutputTokens: 250,
          temperature: 0.85,
          topP: 0.92,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return new Response(
        JSON.stringify({
          error: `Gemini API error (${geminiRes.status})`,
          details: errText,
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiData = await geminiRes.json();
    const replyText: string =
      geminiData?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? '')
        .join('')
        .trim() ||
      `Remember: ${persona.catchphrases[0]}`;

    const catchphraseUsed = persona.catchphrases.find((cp) =>
      replyText.toLowerCase().includes(cp.toLowerCase())
    );

    return new Response(
      JSON.stringify({
        reply: replyText,
        catchphraseUsed,
        model: geminiModel,
        historyWindowUsed: recentHistory.length,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unexpected server error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
