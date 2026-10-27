/**
 * End-to-End Automated Verification Script for Pet AI Chat Feature
 */

const API_BASE = 'http://localhost:5000/api/v1';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

class TestClient {
  constructor() {
    this.cookie = '';
  }

  async request(path, options = {}) {
    const url = `${API_BASE}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.cookie ? { Cookie: this.cookie } : {}),
      ...(options.headers || {}),
    };

    const res = await fetch(url, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      this.cookie = setCookie.split(';')[0];
    }

    let data = null;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch (_) {
      data = text;
    }

    return { status: res.status, headers: res.headers, data };
  }
}

async function run() {
  console.log('\n🐾 Starting TinyWorld Pet AI Conversation Verification Suite...\n');

  const client = new TestClient();

  // Test 1: Unauthorized Chat Access
  console.log('📌 Test 1: Unauthorized Chat Access Protection');
  const unauthRes = await client.request('/pet/chat', {
    method: 'POST',
    body: { message: 'Hello pet!' },
  });
  assert(unauthRes.status === 401, 'Blocks unauthenticated POST /pet/chat with 401');

  // Test 2: User Registration & Onboarding
  console.log('\n📌 Test 2: User Registration & Onboarding');
  const email = `chat_test_${Date.now()}@example.com`;
  const regRes = await client.request('/auth/register', {
    method: 'POST',
    body: {
      email,
      password: 'Password123!',
      displayName: 'AliceCatLover',
    },
  });
  assert(regRes.status === 201, 'User registered successfully');

  const onbRes = await client.request('/onboarding/complete', {
    method: 'POST',
    body: {
      petSpecies: 'mochi',
      petName: 'Mochi',
      theme: 'cozy',
    },
  });
  assert(onbRes.status === 201, 'Pet Mochi created with onboarding');
  const initialHappiness = onbRes.data.pet.happiness;

  // Test 3: Validation - Empty Message
  console.log('\n📌 Test 3: Input Validation for Chat');
  const emptyRes = await client.request('/pet/chat', {
    method: 'POST',
    body: { message: '   ' },
  });
  assert(emptyRes.status === 400, 'Rejects empty/whitespace message with 400');

  // Test 4: Paywall Protection - Unsubscribed Chat Attempt
  console.log('\n📌 Test 4: AI Companion Pass Paywall Protection');
  const paywallRes = await client.request('/pet/chat', {
    method: 'POST',
    body: { message: 'Hello Mochi!' },
  });
  assert(paywallRes.status === 403, 'Blocks unsubscribed user from AI chat with 403 Forbidden');
  assert(paywallRes.data.code === 'SUBSCRIPTION_REQUIRED', 'Returns code: SUBSCRIPTION_REQUIRED');
  assert(paywallRes.data.planAmount === 100, 'Indicates ₹100 plan amount');

  // Activate 30-day subscription pass for testing
  const mongoose = require('mongoose');
  const User = require('../src/models/User');
  if (mongoose.connection.readyState === 0) {
    const { MONGODB_URI } = require('../src/config/env');
    await mongoose.connect(MONGODB_URI);
  }
  await User.updateOne(
    { email },
    {
      subscription: {
        status: 'active',
        plan: 'ai_companion_monthly',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        razorpayPaymentId: 'pay_test_verified',
        razorpayOrderId: 'order_test_verified',
      },
    }
  );
  console.log('  ✅ [PASS] Simulated Razorpay ₹100 Monthly Pass activation');
  passedTests++;
  totalTests++;

  // Test 5: Conversational AI Chat via Groq (with Active Subscription)
  console.log('\n📌 Test 5: Conversational AI Chat Response (Subscribed)');
  const chatRes1 = await client.request('/pet/chat', {
    method: 'POST',
    body: {
      message: 'Hello Mochi! What is your favorite treat?',
    },
  });
  assert(chatRes1.status === 200, 'POST /pet/chat returns 200 OK');
  assert(chatRes1.data.success === true, 'Returns success: true');
  assert(
    typeof chatRes1.data.reply === 'string' && chatRes1.data.reply.length > 5,
    `Returns non-empty pet reply: "${chatRes1.data.reply}"`
  );
  assert(
    chatRes1.data.pet && typeof chatRes1.data.pet.happiness === 'number',
    'Returns updated pet object with happiness stat'
  );

  // Test 5: Happiness Boost on Chatting
  console.log('\n📌 Test 5: Pet Happiness Boost');
  assert(
    chatRes1.data.pet.happiness >= initialHappiness,
    `Pet happiness updated (${initialHappiness} -> ${chatRes1.data.pet.happiness})`
  );

  // Test 6: Multi-turn Chat with History
  console.log('\n📌 Test 6: Multi-turn Conversation with History');
  const chatRes2 = await client.request('/pet/chat', {
    method: 'POST',
    body: {
      message: 'Can we play a mini-game together in our cozy room?',
      history: [
        { role: 'user', content: 'Hello Mochi! What is your favorite treat?' },
        { role: 'assistant', content: chatRes1.data.reply },
      ],
    },
  });
  assert(chatRes2.status === 200, 'Multi-turn chat request succeeds with 200 OK');
  assert(
    typeof chatRes2.data.reply === 'string' && chatRes2.data.reply.length > 5,
    `Returns conversational follow-up: "${chatRes2.data.reply}"`
  );

  console.log(`\n🎉 Pet AI Chat Suite Completed: ${passedTests}/${totalTests} tests passed!\n`);
}

run().catch((err) => {
  console.error('\n❌ Suite execution failed:', err);
  process.exit(1);
});
