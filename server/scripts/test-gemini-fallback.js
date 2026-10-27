const { GEMINI_API_KEY } = require('../src/config/env');

async function testGeminiDirect() {
  console.log('\n🤖 Testing Google Gemini Backup AI Provider...');
  console.log('Gemini Key:', GEMINI_API_KEY ? 'Configured ✅' : 'Missing ❌');

  const systemPrompt = `You are Mochi, a cozy virtual pet companion in TinyWorld.
Guidelines:
1. Speak in first person as Mochi. Be natural, affectionate, warm, and playful.
2. Keep your response very brief and conversational (1 to 2 short sentences, 10 to 25 words).
3. Do NOT speak like an AI or robotic assistant.
4. Use occasional gentle pet expressions like *purrs* and cute emojis (🐾, 💕, ✨).`;

  const userMessage = 'Good morning Mochi, are you ready for today?';

  const modelsToTry = ['gemini-flash-lite-latest', 'gemini-3.8-flash'];
  let reply = '';
  let usedModel = '';

  for (const modelName of modelsToTry) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: 'user', parts: [{ text: userMessage }] }],
            generationConfig: { maxOutputTokens: 90, temperature: 0.8 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        if (reply) {
          usedModel = modelName;
          break;
        }
      }
    } catch (e) {
      console.warn(`Model ${modelName} error:`, e.message);
    }
  }

  if (reply) {
    console.log(`✅ [PASS] Gemini Backup API Succeeded using model: ${usedModel}`);
    console.log(`💬 Mochi's Reply: "${reply}"\n`);
  } else {
    console.error('❌ [FAIL] Gemini backup call failed.');
    process.exit(1);
  }
}

testGeminiDirect();
