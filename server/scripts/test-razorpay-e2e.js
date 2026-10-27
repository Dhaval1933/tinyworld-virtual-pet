const crypto = require('crypto');

const API_BASE = 'http://localhost:5000/api/v1';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
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

async function runRazorpayE2ETest() {
  console.log('\n💳 Starting Razorpay Subscription E2E Verification Suite...\n');
  const client = new TestClient();

  const testEmail = `razorpay_user_${Date.now()}@example.com`;
  const testPassword = 'Password123!';

  try {
    // Step 1: Register User
    console.log('📌 Test 1: User Registration & Initial State');
    const regRes = await client.request('/auth/register', {
      method: 'POST',
      body: {
        email: testEmail,
        password: testPassword,
        displayName: 'Paywall Tester',
      },
    });
    assert(regRes.status === 201, 'User registered successfully (201)');
    assert(regRes.data.user.hasAiSubscription === false, 'New user does not have AI subscription');

    // Step 2: Complete Onboarding with Pet
    console.log('\n📌 Test 2: Onboard Pet');
    const onboardRes = await client.request('/onboarding/complete', {
      method: 'POST',
      body: {
        petSpecies: 'mochi',
        petName: 'Pixel',
        theme: 'cozy',
      },
    });
    assert(onboardRes.status === 201, 'Pet Pixel onboarded successfully');

    // Step 3: Check AI Chat Paywall (Should block with 403)
    console.log('\n📌 Test 3: Verify AI Chat Paywall Block');
    const blockedRes = await client.request('/pet/chat', {
      method: 'POST',
      body: { message: 'Hello Pixel!' },
    });
    assert(blockedRes.status === 403, 'AI Chat rejected with 403 Forbidden for unsubscribed user');
    assert(blockedRes.data.code === 'SUBSCRIPTION_REQUIRED', 'Error code is SUBSCRIPTION_REQUIRED');
    assert(blockedRes.data.planAmount === 100, 'Requires ₹100 plan amount');

    // Step 4: Create Real Razorpay Order via Gateway
    console.log('\n📌 Test 4: Create Real Razorpay Order via Gateway');
    const orderRes = await client.request('/subscription/create-order', {
      method: 'POST',
      body: {},
    });
    assert(orderRes.status === 200, 'POST /subscription/create-order returned 200 OK');
    assert(orderRes.data.orderId && orderRes.data.orderId.startsWith('order_'), `Order created successfully on Razorpay: ${orderRes.data.orderId}`);
    assert(orderRes.data.amount === 10000, 'Order amount is 10000 paise (₹100)');
    assert(orderRes.data.currency === 'INR', 'Currency is INR');
    assert(orderRes.data.keyId === 'rzp_test_Tkjpc5UKLOkdMH', 'Returns user Razorpay Test Key ID');

    const orderId = orderRes.data.orderId;
    const dummyPaymentId = `pay_test_${Date.now()}`;

    // Step 5: Test Invalid Signature Rejection
    console.log('\n📌 Test 5: Reject Invalid Payment Signature');
    const invalidRes = await client.request('/subscription/verify-payment', {
      method: 'POST',
      body: {
        razorpay_order_id: orderId,
        razorpay_payment_id: dummyPaymentId,
        razorpay_signature: 'invalid_fraudulent_signature_hex',
      },
    });
    assert(invalidRes.status === 400, 'Invalid signature rejected with 400 Bad Request');

    // Step 6: Verify Payment with Authentic HMAC Signature
    console.log('\n📌 Test 6: Verify Legitimate Payment with HMAC SHA256 Signature');
    const keySecret = 'UMQVkIXWOk6CKE3vMyEhfGyu';
    const validSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${dummyPaymentId}`)
      .digest('hex');

    const verifyRes = await client.request('/subscription/verify-payment', {
      method: 'POST',
      body: {
        razorpay_order_id: orderId,
        razorpay_payment_id: dummyPaymentId,
        razorpay_signature: validSignature,
      },
    });

    assert(verifyRes.status === 200, 'Payment verification returned 200 OK');
    assert(verifyRes.data.success === true, 'Verification returns success: true');
    assert(verifyRes.data.user.hasAiSubscription === true, 'User now has active AI subscription');
    assert(verifyRes.data.user.subscription.status === 'active', 'User subscription status is active');

    // Step 7: Check Subscription Status Endpoint
    console.log('\n📌 Test 7: GET /subscription/status');
    const statusRes = await client.request('/subscription/status', { method: 'GET' });
    assert(statusRes.status === 200, 'GET /subscription/status returned 200');
    assert(statusRes.data.hasActiveSubscription === true, 'Status hasActiveSubscription is true');
    assert(statusRes.data.subscription.daysRemaining >= 29, `Days remaining is ${statusRes.data.subscription.daysRemaining} days`);

    // Step 8: Post-Subscription AI Chat Access Unlocked!
    console.log('\n📌 Test 8: Subscribed AI Chat Unlocked & Working');
    const chatRes = await client.request('/pet/chat', {
      method: 'POST',
      body: { message: 'Hello Pixel, do you like your new cozy room?' },
    });
    assert(chatRes.status === 200, 'Subscribed AI Chat returned 200 OK');
    assert(chatRes.data.success === true, 'Chat returned success: true');
    assert(typeof chatRes.data.reply === 'string' && chatRes.data.reply.length > 0, `Pet replied: "${chatRes.data.reply}"`);
    assert(chatRes.data.pet.happiness > 80, `Pet happiness increased to ${chatRes.data.pet.happiness}`);

    console.log(`\n🎉 Razorpay E2E Verification Completed: ${passed}/${total} tests passed!\n`);
  } catch (error) {
    console.error('Fatal test error:', error);
    process.exitCode = 1;
  }
}

runRazorpayE2ETest();
