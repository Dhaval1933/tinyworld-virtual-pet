/**
 * Automated Verification Suite for Activities, Focus Sessions, Progression, Economy & Achievements
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
    } catch {
      data = text;
    }

    return {
      status: res.status,
      headers: res.headers,
      data,
    };
  }

  get(path) {
    return this.request(path, { method: 'GET' });
  }

  post(path, body) {
    return this.request(path, { method: 'POST', body });
  }

  patch(path, body) {
    return this.request(path, { method: 'PATCH', body });
  }
}

async function runActivityProgressionTests() {
  console.log('\n🌟 Starting TinyWorld Activities & Progression Verification Suite...\n');

  const ts = Date.now();
  const userA = {
    displayName: 'Aria Focus',
    email: `aria_${ts}@tinyworld.test`,
    password: 'AriaPassword123!',
  };

  const userB = {
    displayName: 'Bram Habit',
    email: `bram_${ts}@tinyworld.test`,
    password: 'BramPassword123!',
  };

  const clientA = new TestClient();
  const clientB = new TestClient();

  // Register & Onboard User A
  await clientA.post('/auth/register', userA);
  await clientA.post('/onboarding/complete', {
    petSpecies: 'mochi',
    petName: 'Purrfect',
    roomTheme: 'cozy',
  });

  // Register & Onboard User B
  await clientB.post('/auth/register', userB);
  await clientB.post('/onboarding/complete', {
    petSpecies: 'pebble',
    petName: 'Hoppy',
    roomTheme: 'forest',
  });

  // ─── TEST 1: Activity Types & Server-Authoritative Rewards ───
  console.log('📌 Test 1: Activity Catalog & Server-Authoritative Rewards');
  {
    const typesRes = await clientA.get('/activities');
    assert(typesRes.status === 200, 'GET /activities succeeds with 200');
    assert(typesRes.data.activities.length >= 7, 'Returns at least 7 activity types');

    const reading = typesRes.data.activities.find((a) => a.type === 'reading');
    assert(reading.rewards.coins === 15, 'Reading reward coins is server-authoritative (15)');
    assert(reading.rewards.xp === 20, 'Reading reward XP is server-authoritative (20)');
  }

  // ─── TEST 2: Activity Completion & Wallet Ledger Recording ───
  console.log('\n📌 Test 2: Activity Completion, XP Gain, & Pet Progression');
  {
    const meBefore = await clientA.get('/auth/me');
    const startCoins = meBefore.data.user.coins;
    const startXP = meBefore.data.user.totalXP;

    const key1 = `key-${ts}-1`;
    const completeRes = await clientA.post('/activities/complete', {
      activityType: 'reading',
      title: 'Read 20 min of Algorithms',
      durationMinutes: 20,
      idempotencyKey: key1,
    });

    assert(completeRes.status === 201, 'Activity completed with 201 Created');
    assert(completeRes.data.rewards.coins === 15, 'Awarded 15 coins');
    assert(completeRes.data.rewards.xp === 20, 'Awarded 20 XP');
    assert(completeRes.data.newBalance >= startCoins + 15, 'User balance incremented');

    // Pet progression check
    const petRes = await clientA.get('/pet');
    assert(petRes.data.pet.experience >= 20, 'Pet gained experience (+20)');
    assert(petRes.data.pet.happiness >= 80, 'Pet happiness maintained/boosted');

    // Achievement unlock check: First Steps
    assert(
      completeRes.data.unlockedAchievements &&
      completeRes.data.unlockedAchievements.some((a) => a.achievementId === 'first-steps'),
      'Automatically unlocked First Steps achievement on 1st activity!'
    );
  }

  // ─── TEST 3: Duplicate Completion Prevention (Idempotency) ───
  console.log('\n📌 Test 3: Duplicate Activity Completion Prevention (Idempotency)');
  {
    const meBefore = await clientA.get('/auth/me');
    const coinsBefore = meBefore.data.user.coins;

    const dupKey = `dup-${ts}`;
    const firstCall = await clientA.post('/activities/complete', {
      activityType: 'studying',
      idempotencyKey: dupKey,
    });
    assert(firstCall.status === 201, 'First call completed with 201');
    const coinsAfterFirst = firstCall.data.newBalance;

    // Second call with EXACT SAME idempotencyKey
    const secondCall = await clientA.post('/activities/complete', {
      activityType: 'studying',
      idempotencyKey: dupKey,
    });
    assert(secondCall.status === 200, 'Duplicate call returns 200 without creating new reward');
    assert(secondCall.data.duplicate === true, 'Response flagged as duplicate: true');

    const meAfter = await clientA.get('/auth/me');
    assert(meAfter.data.user.coins === coinsAfterFirst, 'User coins did not double-increment');
  }

  // ─── TEST 4: Invalid Activity Validation ───
  console.log('\n📌 Test 4: Input Validation for Activity Completion');
  {
    const badType = await clientA.post('/activities/complete', {
      activityType: 'illegal_cheat_action',
      idempotencyKey: `bad-${ts}`,
    });
    assert(badType.status === 400, 'Rejects invalid activityType with 400');

    const missingKey = await clientA.post('/activities/complete', {
      activityType: 'reading',
    });
    assert(missingKey.status === 400, 'Rejects missing idempotencyKey with 400');
  }

  // ─── TEST 5: Daily Goal & Summary ───
  console.log('\n📌 Test 5: Daily Goals & Summary');
  {
    const summaryRes = await clientA.get('/activities/summary');
    assert(summaryRes.status === 200, 'GET /activities/summary succeeds with 200');
    assert(summaryRes.data.summary.todayActivities >= 2, 'Summary reflects today completed activities');
    assert(summaryRes.data.summary.todayLimit === 10, 'Daily limit is 10 activities');
  }

  // ─── TEST 6: Shop Catalog, Level Locks, & Invalid Item IDs ───
  console.log('\n📌 Test 6: Shop Catalog, Invalid Item IDs, & Level Lock Enforcement');
  {
    const catalog = await clientA.get('/shop');
    assert(catalog.status === 200, 'GET /shop catalog returns 200');
    assert(catalog.data.items.length >= 18, 'Catalog contains all seeded items');

    // Invalid item ID purchase
    const badItem = await clientA.post('/shop/purchase', {
      itemId: 'fake-nonexistent-sword-999',
    });
    assert(badItem.status === 404, 'Rejects nonexistent itemId with 404 Not Found');

    // Level locked purchase (Level 3 item: hanging-ivy)
    const levelLock = await clientA.post('/shop/purchase', {
      itemId: 'hanging-ivy', // requires Level 3, User A is Level 1
    });
    assert(levelLock.status === 403, 'Rejects purchase of level-locked item with 403 Forbidden');
    assert(levelLock.data.message.includes('level 3'), 'Specifies required level in error');
  }

  // ─── TEST 7: Insufficient Coins & Valid Purchase Flow ───
  console.log('\n📌 Test 7: Insufficient Coins Rejection & Valid Purchase Flow');
  {
    // Check balance
    const me = await clientA.get('/auth/me');
    const balance = me.data.user.coins;

    // Try to purchase something that costs more than available balance (e.g. cloud-wallpaper costs 150 + level 3, or multiple items)
    // First, buy photo-frame (35 coins) — triggers 'shopaholic' achievement (+25 coins reward!)
    const buyFrame = await clientA.post('/shop/purchase', {
      itemId: 'photo-frame',
    });
    assert(buyFrame.status === 200, 'Purchased Photo Frame for 35 coins');
    assert(
      buyFrame.data.unlockedAchievements &&
      buyFrame.data.unlockedAchievements.some((a) => a.achievementId === 'shopaholic'),
      'Unlocked Shopaholic achievement on first purchase'
    );
    assert(buyFrame.data.newBalance === balance - 35 + 25, 'Net balance accounts for -35 item price and +25 achievement bonus');

    // Verify photo-frame is now in inventory
    const invRes = await clientA.get('/shop/inventory');
    const ownedIds = invRes.data.inventory.map((i) => i.itemId);
    assert(ownedIds.includes('photo-frame'), 'Photo Frame added to user inventory');

    // Verify duplicate purchase of non-stackable item is rejected
    const dupBuy = await clientA.post('/shop/purchase', {
      itemId: 'photo-frame',
    });
    assert(dupBuy.status === 409, 'Rejects buying duplicate non-stackable item with 409 Conflict');

    // Test Insufficient Coins: A user with 0 coins attempts to purchase Photo Frame (costs 35 coins)
    const userC = {
      displayName: 'Broke Charlie',
      email: `charlie_${ts}@tinyworld.test`,
      password: 'CharliePassword123!',
    };
    const clientC = new TestClient();
    await clientC.post('/auth/register', userC); // Starts with 0 coins
    const brokeRes = await clientC.post('/shop/purchase', { itemId: 'photo-frame' });
    assert(brokeRes.status === 400, 'Rejects purchase when balance is insufficient (400)');
    assert(brokeRes.data.message === 'Insufficient coins.', 'Error explicitly states Insufficient coins.');
  }

  // ─── TEST 8: Wallet Activity Ledger & User Data Isolation ───
  console.log('\n📌 Test 8: Wallet Transaction Ledger & Strict User Isolation');
  {
    const progA = await clientA.get('/progress');
    const progB = await clientB.get('/progress');

    assert(progA.status === 200, 'User A progress retrieved');
    assert(progB.status === 200, 'User B progress retrieved');

    // User A has activities, User B has 0 activities
    assert(progA.data.progress.stats.totalActivities >= 2, 'User A total activities tracked');
    assert(progB.data.progress.stats.totalActivities === 0, 'User B has 0 activities (isolated)');

    // Check wallet transactions for User A: must include earn and spend
    const txA = progA.data.progress.recentTransactions;
    assert(txA.length >= 2, 'User A has recorded wallet transactions');
    const typesA = txA.map((t) => t.transactionType);
    assert(typesA.includes('earn'), 'Wallet ledger records earn transactions');
    assert(typesA.includes('spend'), 'Wallet ledger records spend transactions');

    // User B purchases desk-and-chair
    const buyB = await clientB.post('/shop/purchase', { itemId: 'desk-and-chair' });
    assert(buyB.status === 200, 'User B successfully purchased desk-and-chair');

    // Check that User B cannot see User A's inventory and vice versa
    const invA = await clientA.get('/shop/inventory');
    const invB = await clientB.get('/shop/inventory');

    const invA_ids = invA.data.inventory.map((i) => i.itemId);
    const invB_ids = invB.data.inventory.map((i) => i.itemId);

    assert(invA_ids.includes('photo-frame'), 'User A owns photo-frame');
    assert(!invB_ids.includes('photo-frame'), 'User B does NOT own photo-frame (isolated)');
    assert(invB_ids.includes('desk-and-chair'), 'User B owns desk-and-chair');
    assert(!invA_ids.includes('desk-and-chair'), 'User A does NOT own desk-and-chair (isolated)');
  }

  console.log(`\n🎉 Activity & Progression Test Suite Completed: ${passedTests}/${totalTests} tests passed!\n`);
}

runActivityProgressionTests().catch((err) => {
  console.error('\n❌ Activity & Progression test suite failed:', err);
  process.exit(1);
});
