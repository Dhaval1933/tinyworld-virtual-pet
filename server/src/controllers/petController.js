const Pet = require('../models/Pet');
const AppError = require('../utils/AppError');
const {
  PET_STAT_MIN, PET_STAT_MAX,
  PET_HUNGER_DECAY, PET_HAPPINESS_DECAY, PET_ENERGY_RECOVERY,
  FEED_HUNGER_GAIN, FEED_HAPPINESS_GAIN, PET_HAPPINESS_GAIN, REST_ENERGY_GAIN,
  FEED_COOLDOWN, PET_COOLDOWN, REST_COOLDOWN,
} = require('../utils/constants');

/**
 * Recalculate pet stats based on elapsed time since last update.
 */
function recalculateStats(pet) {
  const now = new Date();
  const elapsed = (now - pet.lastNeedsUpdateAt) / 3600000; // hours

  if (elapsed > 0) {
    pet.hunger = clamp(pet.hunger - elapsed * PET_HUNGER_DECAY);
    pet.happiness = clamp(pet.happiness - elapsed * PET_HAPPINESS_DECAY);
    pet.energy = clamp(pet.energy + elapsed * PET_ENERGY_RECOVERY);
    pet.lastNeedsUpdateAt = now;
  }
  return pet;
}

function clamp(value) {
  return Math.round(Math.max(PET_STAT_MIN, Math.min(PET_STAT_MAX, value)));
}

function checkCooldown(lastActionAt, cooldownMs, actionName) {
  if (lastActionAt) {
    const elapsed = Date.now() - new Date(lastActionAt).getTime();
    if (elapsed < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - elapsed) / 60000);
      throw new AppError(`${actionName} is on cooldown. Try again in ${remaining} minute(s).`, 429);
    }
  }
}

/**
 * GET /api/v1/pet
 */
exports.getPet = async (req, res, next) => {
  try {
    let pet = await Pet.findOne({ userId: req.user._id });
    if (!pet) {
      throw new AppError('Pet not found. Complete onboarding first.', 404);
    }

    pet = recalculateStats(pet);
    await pet.save();

    res.json({ success: true, pet });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/pet/name
 */
exports.updateName = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 1 || name.trim().length > 20) {
      throw new AppError('Pet name must be 1–20 characters.', 400);
    }

    const pet = await Pet.findOneAndUpdate(
      { userId: req.user._id },
      { name: name.trim() },
      { new: true }
    );

    if (!pet) throw new AppError('Pet not found.', 404);

    res.json({ success: true, pet });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/pet/feed
 */
exports.feed = async (req, res, next) => {
  try {
    let pet = await Pet.findOne({ userId: req.user._id });
    if (!pet) throw new AppError('Pet not found.', 404);

    pet = recalculateStats(pet);
    checkCooldown(pet.lastFedAt, FEED_COOLDOWN, 'Feeding');

    pet.hunger = clamp(pet.hunger + FEED_HUNGER_GAIN);
    pet.happiness = clamp(pet.happiness + FEED_HAPPINESS_GAIN);
    pet.lastFedAt = new Date();
    await pet.save();

    res.json({
      success: true,
      pet,
      message: `${pet.name} enjoyed the meal! 🍽️`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/pet/pet
 */
exports.petPet = async (req, res, next) => {
  try {
    let pet = await Pet.findOne({ userId: req.user._id });
    if (!pet) throw new AppError('Pet not found.', 404);

    pet = recalculateStats(pet);
    checkCooldown(pet.lastPettedAt, PET_COOLDOWN, 'Petting');

    pet.happiness = clamp(pet.happiness + PET_HAPPINESS_GAIN);
    pet.lastPettedAt = new Date();
    await pet.save();

    res.json({
      success: true,
      pet,
      message: `${pet.name} loves the attention! 💕`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/pet/rest
 */
exports.rest = async (req, res, next) => {
  try {
    let pet = await Pet.findOne({ userId: req.user._id });
    if (!pet) throw new AppError('Pet not found.', 404);

    pet = recalculateStats(pet);
    checkCooldown(pet.lastRestedAt, REST_COOLDOWN, 'Resting');

    pet.energy = clamp(pet.energy + REST_ENERGY_GAIN);
    pet.lastRestedAt = new Date();
    await pet.save();

    res.json({
      success: true,
      pet,
      message: `${pet.name} had a nice rest! 😴`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/pet/chat
 * User speaks or types to their pet; pet responds with personality using Groq AI.
 */
exports.chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || !message.trim()) {
      throw new AppError('Message is required.', 400);
    }

    const cleanMessage = message.trim().slice(0, 300);

    // Verify user has active AI Companion subscription pass (Paywall)
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    if (!user || !user.hasActiveAiSubscription()) {
      return res.status(403).json({
        success: false,
        code: 'SUBSCRIPTION_REQUIRED',
        message: 'TinyWorld AI Companion Pass (₹100/mo) is required to chat with your pet.',
        planAmount: 100,
      });
    }

    let pet = await Pet.findOne({ userId: req.user._id });
    if (!pet) throw new AppError('Pet not found. Complete onboarding first.', 404);

    pet = recalculateStats(pet);

    // Build species-aware personality prompt
    const speciesDesc =
      pet.species === 'mochi'
        ? 'a cuddly, curious kitten who loves fish, yarn, and cozy purrs'
        : pet.species === 'pebble'
        ? 'an energetic, cheerful bunny who loves hopping, fresh greens, and adventures'
        : 'a gentle, peaceful sprout plant spirit who loves sunshine, watering, and calm vibes';

    const soundCues =
      pet.species === 'mochi'
        ? '*purrs*, *meows*, or *bats paws*'
        : pet.species === 'pebble'
        ? '*wiggles nose*, *hops happily*, or *twitches ears*'
        : '*rustles leaves gently*, *sprouts a flower*, or *glows softly*';

    const systemPrompt = `You are ${pet.name}, a cozy virtual pet companion in TinyWorld.
Your species is ${speciesDesc}.
Your owner is ${req.user.displayName || 'friend'}.
Your current status:
- Hunger: ${pet.hunger}/100
- Happiness: ${pet.happiness}/100
- Energy: ${pet.energy}/100

Guidelines:
1. Speak in first person as ${pet.name}. Be natural, affectionate, warm, and playful — talk like a real loyal pet companion to their beloved human.
2. Keep your response very brief and conversational (1 to 2 short sentences, 10 to 25 words).
3. Do NOT speak like an AI or robotic assistant. Avoid formal phrasing like "Certainly", "I can assist you", or mechanical explanations.
4. Use occasional gentle pet expressions like ${soundCues} and cute emojis (🐾, 💕, ✨).`;

    let replyText = '';

    const { GROQ_API_KEY, GEMINI_API_KEY } = require('../config/env');

    // 1. Primary AI Provider: Groq (ultra-fast Qwen)
    if (GROQ_API_KEY) {
      try {
        const formattedHistory = (Array.isArray(history) ? history.slice(-4) : []).map((h) => ({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: String(h.content || '').slice(0, 200),
        }));

        const messages = [
          { role: 'system', content: systemPrompt },
          ...formattedHistory,
          { role: 'user', content: cleanMessage },
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'qwen/qwen3.8-27b',
            messages,
            max_tokens: 80,
            temperature: 0.75,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          replyText = data.choices?.[0]?.message?.content?.trim() || '';
        } else {
          const errData = await response.text();
          console.warn('Groq API error response:', response.status, errData);
        }
      } catch (apiErr) {
        console.warn('Groq fetch error:', apiErr.message);
      }
    }

    // 2. Backup AI Provider: Google Gemini AI Studio (high resilience fallback)
    if (!replyText && GEMINI_API_KEY) {
      try {
        const geminiContents = [];
        const recentHistory = Array.isArray(history) ? history.slice(-4) : [];
        for (const item of recentHistory) {
          geminiContents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: String(item.content || '').slice(0, 200) }],
          });
        }
        geminiContents.push({
          role: 'user',
          parts: [{ text: cleanMessage }],
        });

        const modelsToTry = ['gemini-flash-lite-latest', 'gemini-3.8-flash'];
        for (const modelName of modelsToTry) {
          try {
            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  systemInstruction: {
                    parts: [{ text: systemPrompt }],
                  },
                  contents: geminiContents,
                  generationConfig: {
                    maxOutputTokens: 90,
                    temperature: 0.8,
                  },
                }),
              }
            );

            if (geminiRes.ok) {
              const geminiData = await geminiRes.json();
              const textCandidate = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
              if (textCandidate) {
                replyText = textCandidate;
                break;
              }
            } else {
              const errBody = await geminiRes.text();
              console.warn(`Gemini (${modelName}) error:`, geminiRes.status, errBody);
            }
          } catch (modelErr) {
            console.warn(`Gemini (${modelName}) request failed:`, modelErr.message);
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini backup fetch error:', geminiErr.message);
      }
    }

    // 3. Charming rule-based fallback if all AI APIs are unreachable or offline
    if (!replyText) {
      const lower = cleanMessage.toLowerCase();
      if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        replyText = `Hello ${req.user.displayName || 'bestie'}! I'm so happy to talk with you! 🐾✨`;
      } else if (lower.includes('love') || lower.includes('cute')) {
        replyText = `I love you too! You're the best owner ever! 💕 *snuggles closer*`;
      } else if (lower.includes('hungry') || lower.includes('food') || lower.includes('eat')) {
        replyText = `Yum! Are we having snacks? My tummy is always ready for treats! 🍓🍪`;
      } else if (lower.includes('tired') || lower.includes('sleep') || lower.includes('nap')) {
        replyText = `*yawns softly* A cozy nap sounds perfect... sweet dreams! 💤✨`;
      } else if (lower.includes('play') || lower.includes('game')) {
        replyText = `Yay! Let's play together! Want to try a mini-game or tickle me? 🎮🐾`;
      } else if (lower.includes('how are you')) {
        replyText = `I feel wonderful because I get to spend time with you! 💕✨`;
      } else {
        const fallbacks = [
          `*tilts head curiously* I love listening to your voice! Tell me more! 🐾`,
          `Hehe, you always know how to make me smile! ✨💕`,
          `*hops with joy* That sounds wonderful, ${req.user.displayName || 'friend'}! 🌸`,
          `I'm right here with you! Everything is better when we're together. 💕`,
        ];
        replyText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }
    }

    // Boost happiness slightly by talking (+2 happiness, max 100)
    pet.happiness = clamp(pet.happiness + 2);
    await pet.save();

    res.json({
      success: true,
      reply: replyText,
      pet,
    });
  } catch (error) {
    next(error);
  }
};
