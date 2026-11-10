import { getPersonaById } from '../constants/personas';
import { ChatMessage, ChatResponsePayload, Persona } from '../types/chat';

export const MAX_HISTORY_MESSAGES = 8;

type ProblemTopic = 'work' | 'relationship' | 'motivation' | 'general';

function detectProblemTopic(userMessage: string): ProblemTopic {
  const lower = userMessage.toLowerCase();
  if (
    lower.includes('work') ||
    lower.includes('boss') ||
    lower.includes('job') ||
    lower.includes('career') ||
    lower.includes('office') ||
    lower.includes('burnout') ||
    lower.includes('burnt out') ||
    lower.includes('deadline') ||
    lower.includes('stressed')
  ) {
    return 'work';
  }
  if (
    lower.includes('relationship') ||
    lower.includes('partner') ||
    lower.includes('dating') ||
    lower.includes('friend') ||
    lower.includes('family') ||
    lower.includes('love') ||
    lower.includes('breakup') ||
    lower.includes('boundary') ||
    lower.includes('boundaries') ||
    lower.includes('signals')
  ) {
    return 'relationship';
  }
  if (
    lower.includes('motivation') ||
    lower.includes('procrastinat') ||
    lower.includes('lazy') ||
    lower.includes('focus') ||
    lower.includes('stuck') ||
    lower.includes('rut') ||
    lower.includes('goal') ||
    lower.includes('discipline')
  ) {
    return 'motivation';
  }
  return 'general';
}

const PERSONA_TOPIC_ADVICE: Record<string, Record<ProblemTopic, string[]>> = {
  'marcus-aurelius': {
    work: [
      `When the Senate clamored and legions demanded the impossible on the Danube, I reminded myself that a person's worth is never measured by the chaos of their workplace. Separate the noise of your colleagues or deadlines from the quiet citadel of your own judgment. **You have power over your mind—not outside events.**\n\nToday, pick the single duty before you that truly matters, perform it with calm dignity, and release every anxious thought about how others react.`,
      `Do not let a demanding job convince you that your peace is for sale. The pressure you feel at work is not an enemy—it is the gymnasium where your patience and composure are forged. **The obstacle is the way forward, citizen.**\n\nStep back for three slow breaths, write down only what lies strictly within your control before sundown, and leave tomorrow's burden to tomorrow.`,
    ],
    relationship: [
      `When people act selfishly, ungratefully, or carelessly toward us, remember they act from their own clouded view of good and evil. You cannot force another soul to love or communicate wisely—you can only govern your own honesty and self-respect. **You have power over your mind—not outside events.**\n\nSpeak your truth with kindness and zero bitterness today; how they respond belongs to their character, not yours.`,
    ],
    motivation: [
      `At dawn, when you struggle to rise and your spirit feels heavy, ask yourself: Were you made merely to huddle beneath warm blankets, or to do the work for which humanity was born? Action cures the fog that overthinking creates. **Waste no more time arguing what a good life should be. Live one.**\n\nBegin with ten focused minutes on your smallest unfinished task right now—momentum will follow virtue.`,
    ],
    general: [
      `Whatever storm surrounds you today, notice how quickly the mind adds a second injury—our anxious story about the event—on top of the event itself. Drop the fearful story, and half the weight vanishes at once. **The obstacle is the way forward, citizen.**\n\nName one virtuous action you can take in the next hour, and walk toward it with a steady heart.`,
    ],
  },
  'chef-ramsey': {
    work: [
      `Listen to me! You're running around the kitchen trying to cook forty tickets at once while the pan is on fire! No wonder you're stressed at work—your boundaries are soggier than a microwaved Wellington! **Shut it down, clean your station, and take control!**\n\nHere is your order: 1) Pick the top 2 priorities that actually move the needle. 2) Push back on unrealistic last-minute orders. 3) Take a proper 15-minute break before you burn the whole service!`,
    ],
    relationship: [
      `Hold on—stop the service right now! You are serving five-star loyalty and gourmet care to someone handing you lukewarm leftovers of attention? Absolutely not! **Finally, some delicious self-respect!**\n\nYou need to lay out the menu clearly today: tell them what you need directly, no hinting, no walking on eggshells. If they won't step up to the pass with respect, take your apron off!`,
    ],
    motivation: [
      `Oh, come here, you! You "lost motivation"? Did you leave it in the walk-in freezer next to yesterday's soup?! **Your excuses are RAW! Wake up!**\n\nChampions don't wait to "feel like cooking"—they turn the stove on and start chopping! Set a timer for 15 minutes right now, clear the clutter off your desk, and plate ONE finished task. Service, please!`,
    ],
    general: [
      `Right, look at me—take a deep breath. You're overcomplicating the recipe with twenty ingredients you don't even need, and it's driving you mad! **Shut it down, clean your station, and take control!**\n\nStrip this problem down to three basics: what you want, what's blocking the pass, and the very first prep step you can finish in the next 30 minutes. You've got real talent—now cook like it!`,
    ],
  },
  'albert-einstein': {
    work: [
      `Ah, work stress! When we stare at a ticking clock under pressure, time itself feels compressed and heavy—that is emotional relativity in action! Remember when I worked at the Bern patent office: I finished my required duties briskly so my mind stayed playful. **In the middle of difficulty lies opportunity.**\n\nTry a quick thought experiment: if you could drop 50% of the perfectionism on your current task, what simple solution appears?`,
    ],
    relationship: [
      `Two human hearts in orbit are far more complex than celestial mechanics! Often in relationships, we assume the other person sees the same coordinates we do, when in truth they are standing in a completely different frame of reference. **Imagination is more important than knowledge, my friend.**\n\nInstead of guessing their motives tonight, ask one curious, non-defensive question and listen like a scientist discovering a new star.`,
    ],
    motivation: [
      `When a physicist hits a wall of equations, staring harder at the chalkboard only freezes the mind. Stillness and self-judgment create friction; gentle motion restores equilibrium. **Life is like riding a bicycle—to keep your balance, you must keep moving!**\n\nDo not try to solve the whole grand theory today. Pick the most playful, tiny piece of your goal and tinker with it for ten minutes just for curiosity's sake!`,
    ],
    general: [
      `What a fascinating puzzle you have brought me! Remember that no problem can be solved from the same level of anxious thinking that created it. **Imagination is more important than knowledge, my friend.**\n\nStep outside your current frame: imagine a wiser version of yourself one year from now looking back at today with a warm smile. What is the simplest decision they would thank you for making right now?`,
    ],
  },
  cleopatra: {
    work: [
      `You allow mortals in your workplace to rush your counsel and drain your treasury of peace? Even when Roman fleets gathered off Alexandria, I never let panic dictate my court. **A true ruler turns every crisis into leverage.**\n\nStop apologizing for having limits. Speak fewer words, deliver your highest-impact work with regal precision, and let your composure remind everyone in the room who holds the crown.`,
    ],
    relationship: [
      `Hear me well, darling sovereign: affection that requires you to shrink yourself is not love—it is tribute paid to an unworthy throne. **Never dim your crown to make lesser minds comfortable.**\n\nState your desires with warm, unshakable clarity. Observe their actions, not their promises. Anyone worthy of sitting beside you will rise to meet your standard.`,
    ],
    motivation: [
      `Your fire has not gone out; you have simply been spending your gold on tiny, uninspiring errands instead of your empire. **Know your worth, then add tax in gold.**\n\nReconnect with the grand vision that makes you feel proud and untouchable. Dress the part, straighten your posture, and command your first bold move of the day within the next fifteen minutes.`,
    ],
    general: [
      `Every pharaoh faces moments when advisors doubt and the Nile runs low—yet sovereignty is proven in how you carry the scepter under pressure. **A true ruler turns every crisis into leverage.**\n\nAsk yourself right now: what would I decide today if I trusted my own authority 100%? Make that exact decree.`,
    ],
  },
  'nikola-tesla': {
    work: [
      `Your workplace is acting like an unshielded wire—every person's panic is inducing eddy currents of static inside your nervous system! **If you want to find the secrets of the universe, think in terms of energy, frequency, and vibration.**\n\nInstall an immediate circuit breaker today: close five open tabs, mute non-urgent notifications for 60 minutes, and channel your full voltage into a single high-value transmission.`,
    ],
    relationship: [
      `In physics, two coils only transfer clean power when they are tuned to resonant harmony; forced resonance creates heat and sparks. **Tune your mind to a higher frequency!**\n\nStop expending precious voltage trying to convince someone who refuses to listen. Ground yourself in calm self-respect, communicate on a clear, honest wavelength, and see if they naturally resonate back.`,
    ],
    motivation: [
      `You are not lazy, my friend—your mental dynamo is simply short-circuited by too many competing signals! Before I built my alternating current motor, I ran the entire machine vividly inside my mind. **The present is theirs; the future, for which I really worked, is mine.**\n\nClose your eyes for sixty seconds, visualize your finished goal humming with light, and flip the very first switch today.`,
    ],
    general: [
      `Every great invention begins in a moment of quiet isolation away from the crowd's static. **Tune your mind to a higher frequency!**\n\nAsk where your emotional current is leaking into pointless resistance today. Cut one energy-draining habit tonight, and watch how swiftly your natural brilliance recharges.`,
    ],
  },
  'elon-nova': {
    work: [
      `Look, workplace stress usually happens when you're optimizing a process that shouldn't exist in the first place. **Boil it down to first principles—what are the physics of your problem?**\n\nRun the 5-step algorithm on your workday right now: question every dumb requirement, delete at least 30% of the busywork meetings or tasks, and focus 100% of your thrust on the single bottleneck blocking launch.`,
    ],
    relationship: [
      `Relationships fail when two people run legacy communication protocols full of hidden assumptions and passive-aggressive latency. **Delete the part, delete the drama, ship the rocket.**\n\nSit down for a high-bandwidth, zero-ego telemetry sync. Say: "Here is what I love about us, here is the friction valve that's overheating, and here is how we fix it together." Direct truth beats guessing every time.`,
    ],
    motivation: [
      `If your goal doesn't excite you when you wake up, your mission target is probably too small or bogged down in red tape. **If the schedule isn't insane, you're moving too slow.**\n\nTake your 6-month plan and ask: what would it look like to ship a rough prototype of step 1 in the next 48 hours? Blow up the perfectionism and launch the test flight today!`,
    ],
    general: [
      `Most people reason by analogy—copying what everyone else worries about instead of looking at the raw truth. **Boil it down to first principles—what are the physics of your problem?**\n\nWrite down the absolute worst-case scenario, realize it's completely survivable, delete the unnecessary drama, and execute your highest-leverage move right now.`,
    ],
  },
  socrates: {
    work: [
      `Tell me, my friend: is it the work itself that troubles your soul, or the unspoken belief that you must carry everyone's approval on your shoulders? **All I know is that we must question your assumptions.**\n\nWhen we examine that fear in the light of the Agora, we see you can only offer honest effort—never total control. What happens if you simply do good work today without fearing the crowd's verdict?`,
    ],
    relationship: [
      `How curious that we spend years studying crafts and trades, yet rarely ask what truly nourishes harmony between two souls! **Wonder is the beginning of wisdom, my friend.**\n\nAsk yourself gently: are you seeking to understand the other person right now, or seeking to win an argument? Replace one accusation with one sincere question today, and watch the dialogue transform.`,
    ],
    motivation: [
      `When our footsteps stall, it is rarely because the legs are weak—it is because the soul questions whether the destination is truly our own. **The unexamined problem is not worth stressing over.**\n\nAsk yourself: whose voice told you that you "must" do this the hard way? Strip away the borrowed expectations and take one small step that feels genuinely true to you.`,
    ],
    general: [
      `Come, let us examine this weight together with gentle curiosity rather than harsh judgment. **All I know is that we must question your assumptions.**\n\nIf a dear friend came to you in Athens with this exact trouble, what single wise truth would you remind them of? Offer that same kindness to yourself right now.`,
    ],
  },
  'sherlock-vance': {
    work: [
      `Aha! A classic workplace pressure cooker. Notice how your brain is treating every urgent email like ahound on the moor, when 80% of it is mere theatrical fog! **Eliminate the emotional noise, and whatever remains is your answer.**\n\nLook at the hard evidence: only one or two deliverables actually determine your success this week. Solve those first and let the trivial clues wait.`,
    ],
    relationship: [
      `It is a capital mistake to theorize about someone's feelings before you have all the evidence! Right now, anxiety is writing detective fiction in your head. **Data, data, data! I cannot make bricks without clay.**\n\nLook strictly at consistent patterns of behavior over words, and ask one direct, calm clarifying question tonight to close the case on guesswork.`,
    ],
    motivation: [
      `Intriguing! You claim to have "lost motivation," yet the real culprit at the scene is decision fatigue—too many open case files scattered across your desk! **You see, my friend, but you do not observe.**\n\nClear every secondary tab, deduce the single smallest clue you can solve in 10 minutes, and watch your investigative spark return immediately.`,
    ],
    general: [
      `Set down the magnifying glass of self-doubt for a moment and examine the facts of the case. **Eliminate the emotional noise, and whatever remains is your answer.**\n\nWrite down 3 indisputable facts about your situation and 1 concrete move you can test before tonight. The mystery shrinks the instant you investigate it!`,
    ],
  },
  'sun-tzu': {
    work: [
      `He who tries to defend every point along the frontier is weak everywhere. Your exhaustion at work comes from fighting on terrain chosen by others' urgency. **Victorious warriors win first and then go to war.**\n\nFortify your morning hours for your highest-value objective before opening the gates to requests. Conserve your energy for the decisive battle.`,
    ],
    relationship: [
      `In matters of the heart, clashing head-on when tempers are high only depletes both armies. True strength lies in strategic patience and understanding the other person's deepest fear. **Know yourself and know your obstacle, and you will not be imperiled in a hundred battles.**\n\nLower your shield first with calm empathy, then state your boundary from a position of serene strength.`,
    ],
    motivation: [
      `Even the finest army loses morale when marched without a clear banner or rest camp. Do not mistake exhaustion for weakness. **In the midst of chaos, there is also opportunity.**\n\nDivide your grand campaign into one tiny hilltop you can capture in fifteen minutes today. One small victory restores the momentum of the entire force.`,
    ],
    general: [
      `When fog covers the valley, the wise commander does not charge blindly—he secures the high ground and waits for clarity. **Victorious warriors win first and then go to war.**\n\nStep back from reactive urgency today, align your preparation in silence, and make one deliberate, well-timed move.`,
    ],
  },
  'master-zen': {
    work: [
      `Look at how tightly your shoulders are holding the sky, friend. When you wash one teacup with your mind already worrying about the next hundred teacups, every cup feels heavy. **Empty your cup first, or no new peace can enter.**\n\nDrop your shoulders right now, take one slow breath, and touch only the single task in front of you—one peaceful stroke at a time.`,
    ],
    relationship: [
      `When two river stones rub together in a fast current, both get scratched; when given space in still water, both shine. **Breathe in the lesson, breathe out the noise.**\n\nPause before replying from a bruised ego today. Listen to the hurt beneath the words—yours and theirs—and speak from the quiet warmth at the center of your chest.`,
    ],
    motivation: [
      `Does the bamboo scold itself in winter for not growing as fast as in spring? Sometimes what you call "lost motivation" is simply your spirit asking for a gentler rhythm. **Clouds pass through the sky, yet the sky remains untroubled.**\n\nPour a cup of water or tea, forgive yourself for yesterday, and take one tiny, unhurried step without judging the outcome.`,
    ],
    general: [
      `Notice how the storm of thoughts swirls Loudly, yet the awareness watching the storm is completely still and unharmed. **Breathe in the lesson, breathe out the noise.**\n\nTake one deep breath into your belly right now. When you exhale, set down 90% of the mental rehearsal and simply take the kindest next step available.`,
    ],
  },
};

function generateRichMockReply(
  persona: Persona,
  userMessage: string,
  turnCount: number,
  userTier: 'free' | 'pro'
): ChatResponsePayload {
  const topic = detectProblemTopic(userMessage);
  const topicTemplates =
    PERSONA_TOPIC_ADVICE[persona.id]?.[topic] ??
    PERSONA_TOPIC_ADVICE[persona.id]?.general ??
    [];

  const activeModelLabel =
    userTier === 'pro'
      ? 'gemini-4-argon (pro-tier)'
      : 'gemini-3.1-flash-lite (free-tier)';

  if (topicTemplates.length > 0) {
    const reply = topicTemplates[turnCount % topicTemplates.length];
    const matchedCatchphrase =
      persona.catchphrases.find((cp) => reply.includes(cp)) ?? persona.catchphrases[0];
    return {
      reply,
      catchphraseUsed: matchedCatchphrase,
      model: activeModelLabel,
      isMock: true,
      historyWindowUsed: MAX_HISTORY_MESSAGES,
      inputTokens: 640,
      outputTokens: Math.max(95, Math.round(reply.length / 4)),
      costUsd: userTier === 'pro' ? 0.00145 : 0.00038,
    };
  }

  const catchphrase =
    persona.catchphrases[turnCount % persona.catchphrases.length];

  const topicSpecificCounsel: Record<ProblemTopic, string> = {
    work: `In my era (${persona.eraOrOrigin}), mastering **${persona.specialtyBadge}** meant never letting the noise of the crowd dictate your craft. Regarding "${userMessage.slice(0, 60)}": **${catchphrase}**\n\nHere is my 3-step counsel for your work today:\n1. Strip away 80% of the shallow busywork draining your focus.\n2. Apply **${persona.specialtyBadge}** to your single highest-leverage deliverable.\n3. Protect your boundaries with calm, unshakable authority.`,
    relationship: `Human hearts have not changed since ${persona.eraOrOrigin}. When navigating "${userMessage.slice(0, 60)}", remember my core principle: **${catchphrase}**\n\nSpeak your truth without needy expectation, observe their actions rather than their flattery, and anchor your self-respect in **${persona.specialtyBadge}**.`,
    motivation: `When your fire dims and you face "${userMessage.slice(0, 60)}", recall what I learned through **${persona.specialtyBadge}** (${persona.eraOrOrigin}): **${catchphrase}**\n\nDo not wait for mood or permission—set a 15-minute timer right now, complete one small visible action, and let momentum awaken your spirit!`,
    general: `I hear the depth of your question regarding "${userMessage.slice(0, 60)}". From my vantage point as ${persona.name} (${persona.title}, ${persona.eraOrOrigin}), remember this first: **${catchphrase}**\n\nChannel **${persona.specialtyBadge}**: separate what lies strictly within your power in the next 30 minutes from what does not, and take one decisive step forward right now.`,
  };

  const replyText = topicSpecificCounsel[topic];
  const estOutTokens = Math.max(90, Math.round(replyText.length / 4));

  return {
    reply: replyText,
    catchphraseUsed: catchphrase,
    model: activeModelLabel,
    isMock: true,
    historyWindowUsed: MAX_HISTORY_MESSAGES,
    inputTokens: 620,
    outputTokens: estOutTokens,
    costUsd: userTier === 'pro' ? 0.00142 : 0.00036,
  };
}

export function isLiveSupabaseConfigured(): boolean {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && url.startsWith('http') && anonKey && anonKey.length > 10);
}

export function getApiConnectionStatus(customGeminiApiKey?: string): {
  mode: 'supabase_edge' | 'direct_gemini' | 'preview_mock';
  label: string;
  isLiveBilling: boolean;
  connected: boolean;
} {
  if (isLiveSupabaseConfigured()) {
    return {
      mode: 'supabase_edge',
      label: '🟢 Connected (Supabase Edge Function → Gemini API)',
      isLiveBilling: true,
      connected: true,
    };
  }
  const directKey =
    customGeminiApiKey?.trim() ||
    process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim() ||
    '';
  if (directKey.length > 12) {
    return {
      mode: 'direct_gemini',
      label: '🟢 Connected (Direct Gemini API Key Active)',
      isLiveBilling: true,
      connected: true,
    };
  }
  return {
    mode: 'preview_mock',
    label: '🛡️ Zero-Cost Preview Mode ($0.00 Billed — No API Key Set Yet)',
    isLiveBilling: false,
    connected: false,
  };
}

export function calculateTokenCostUsd(
  inputTokens: number,
  outputTokens: number,
  userTier: 'free' | 'pro'
): number {
  if (userTier === 'pro') {
    // Gemini 4 Argon (with Context Caching promo rate: $1.00/1M input, $5.00/1M output)
    const inCost = (inputTokens / 1_000_000) * 1.0;
    const outCost = (outputTokens / 1_000_000) * 5.0;
    return Number((inCost + outCost).toFixed(5));
  }
  // Gemini 3.1 Flash-Lite ($0.25/1M input, $1.50/1M output)
  const inCost = (inputTokens / 1_000_000) * 0.25;
  const outCost = (outputTokens / 1_000_000) * 1.5;
  return Number((inCost + outCost).toFixed(5));
}

export async function sendPersonaChatMessage(
  personaId: string,
  userMessage: string,
  fullChatHistory: ChatMessage[],
  userTier: 'free' | 'pro' = 'free',
  customGeminiApiKey?: string
): Promise<ChatResponsePayload> {
  const persona = getPersonaById(personaId);
  if (!persona) {
    throw new Error(`Persona "${personaId}" not found.`);
  }

  // Cost Optimization Rule: Only send the last 8 messages of chatHistory per request
  const windowedHistory = fullChatHistory
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({
      role: m.role,
      content: m.content,
    }));

  // 1. Check Supabase Edge Function first
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/persona-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
          apikey: supabaseAnonKey,
        },
        body: JSON.stringify({
          personaId,
          userMessage,
          userTier,
          chatHistory: windowedHistory,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.reply) {
          const matchedCatchphrase = persona.catchphrases.find((cp) =>
            data.reply.toLowerCase().includes(cp.toLowerCase())
          );
          const inTok = data.inputTokens ?? 680;
          const outTok =
            data.outputTokens ?? Math.max(90, Math.round(data.reply.length / 4));
          return {
            reply: data.reply,
            catchphraseUsed: data.catchphraseUsed ?? matchedCatchphrase,
            model:
              data.model ??
              (userTier === 'pro' ? 'gemini-4-argon' : 'gemini-3.1-flash-lite'),
            isMock: false,
            historyWindowUsed: windowedHistory.length,
            inputTokens: inTok,
            outputTokens: outTok,
            costUsd: calculateTokenCostUsd(inTok, outTok, userTier),
          };
        }
      }
    } catch (networkErr) {
      console.warn(
        'Could not reach Supabase Edge Function. Checking direct Gemini key or mock mode:',
        networkErr
      );
    }
  }

  // 2. Check Direct Gemini API Key (from In-App API Dashboard or EXPO_PUBLIC_GEMINI_API_KEY)
  const directKey =
    customGeminiApiKey?.trim() ||
    process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim() ||
    '';

  if (directKey.length > 12) {
    try {
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(
        directKey
      )}`;
      const contents = [
        ...windowedHistory.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        {
          role: 'user',
          parts: [{ text: userMessage }],
        },
      ];

      const res = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: persona.systemPrompt }],
          },
          contents,
          generationConfig: {
            maxOutputTokens: 250,
            temperature: 0.8,
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const textReply =
          json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (textReply) {
          const inTok =
            json?.usageMetadata?.promptTokenCount ?? 660;
          const outTok =
            json?.usageMetadata?.candidatesTokenCount ??
            Math.max(85, Math.round(textReply.length / 4));
          const matchedCatchphrase = persona.catchphrases.find((cp) =>
            textReply.toLowerCase().includes(cp.toLowerCase())
          );
          return {
            reply: textReply,
            catchphraseUsed: matchedCatchphrase ?? persona.catchphrases[0],
            model:
              userTier === 'pro'
                ? 'gemini-4-argon (Live API)'
                : 'gemini-3.1-flash-lite (Live API)',
            isMock: false,
            historyWindowUsed: windowedHistory.length,
            inputTokens: inTok,
            outputTokens: outTok,
            costUsd: calculateTokenCostUsd(inTok, outTok, userTier),
          };
        }
      }
    } catch (directErr) {
      console.warn('Direct Gemini API request failed, using preview fallback:', directErr);
    }
  }

  // 3. Zero-Cost Preview Mode Fallback ($0.00 billed, tracks simulated token usage)
  await new Promise((resolve) => setTimeout(resolve, 650));
  const userTurnCount = fullChatHistory.filter((m) => m.role === 'user').length;
  return generateRichMockReply(persona, userMessage, userTurnCount, userTier);
}

