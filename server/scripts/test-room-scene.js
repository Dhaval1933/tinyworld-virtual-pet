/**
 * Automated Verification Script for Room Scene, Layout Persistence, Bounds & Security
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

async function runRoomTests() {
  console.log('\n🏠 Starting TinyWorld Room Scene & Layout Verification Suite...\n');

  const ts = Date.now();
  const user = {
    displayName: 'Room Designer Maya',
    email: `maya_room_${ts}@tinyworld.test`,
    password: 'CozyRoomPassword123!',
  };

  const client = new TestClient();

  // ─── TEST 1: Unauthorized Access Protection ───
  console.log('📌 Test 1: Unauthorized Room Access Protection');
  {
    const unauthGet = await client.get('/world');
    assert(unauthGet.status === 401, 'Blocks unauthenticated GET /world with 401');

    const unauthPatch = await client.patch('/world/layout', { roomLayout: [] });
    assert(unauthPatch.status === 401, 'Blocks unauthenticated PATCH /world/layout with 401');
  }

  // ─── TEST 2: Register & Complete Onboarding with Starter Room ───
  console.log('\n📌 Test 2: User Registration & Starter Room Auto-Initialization');
  {
    const regRes = await client.post('/auth/register', user);
    assert(regRes.status === 201, 'User registered successfully');

    const onboardRes = await client.post('/onboarding/complete', {
      petSpecies: 'sprout',
      petName: 'Leafy',
      roomTheme: 'forest',
    });
    assert(onboardRes.status === 201, 'Onboarding completed');
    assert(onboardRes.data.world.roomLayout.length >= 3, 'Starter room created with >= 3 starter items');
    assert(onboardRes.data.world.roomTheme === 'forest', 'World created with forest theme');

    // Verify starter items exist in room
    const itemIds = onboardRes.data.world.roomLayout.map((i) => i.itemId);
    assert(itemIds.includes('small-wooden-bed'), 'Starter bed placed in room');
    assert(itemIds.includes('round-rug'), 'Starter rug placed in room');
    assert(itemIds.includes('potted-plant'), 'Starter plant placed in room');
  }

  // ─── TEST 3: Fetching Room Layout ───
  console.log('\n📌 Test 3: Fetch Room Layout & Normalized Coordinates');
  {
    const worldRes = await client.get('/world');
    assert(worldRes.status === 200, 'GET /world succeeds with 200');
    assert(Array.isArray(worldRes.data.world.roomLayout), 'roomLayout is an array');

    for (const item of worldRes.data.world.roomLayout) {
      assert(item.x >= 0 && item.x <= 1, `Item ${item.itemId} has normalized x: ${item.x}`);
      assert(item.y >= 0 && item.y <= 1, `Item ${item.itemId} has normalized y: ${item.y}`);
    }
  }

  // ─── TEST 4: Layout Updating, Drag Movement & Rotation Persistence ───
  console.log('\n📌 Test 4: Drag Movement, Rotation, & MongoDB Persistence');
  {
    const updatedLayout = [
      {
        placementId: 'item-bed-1',
        itemId: 'small-wooden-bed',
        x: 0.35,
        y: 0.70,
        rotation: 45,
        layer: 1,
      },
      {
        placementId: 'item-rug-1',
        itemId: 'round-rug',
        x: 0.55,
        y: 0.75,
        rotation: 90,
        layer: 0,
      },
    ];

    const patchRes = await client.patch('/world/layout', { roomLayout: updatedLayout });
    assert(patchRes.status === 200, 'PATCH /world/layout succeeds with 200');
    assert(patchRes.data.roomLayout.length === 2, 'Layout updated to 2 items');

    // Verify persistence with a fresh GET request
    const freshWorld = await client.get('/world');
    const bed = freshWorld.data.world.roomLayout.find((i) => i.itemId === 'small-wooden-bed');
    assert(bed.x === 0.35, 'Persisted updated x coordinate (0.35)');
    assert(bed.y === 0.70, 'Persisted updated y coordinate (0.70)');
    assert(bed.rotation === 45, 'Persisted rotation angle (45°)');
  }

  // ─── TEST 5: Bounds Checking & Input Validation ───
  console.log('\n📌 Test 5: Bounds Checking & Coordinate Validation');
  {
    // Out of bounds x > 1
    const oobX = await client.patch('/world/layout', {
      roomLayout: [
        { placementId: 'p1', itemId: 'small-wooden-bed', x: 1.5, y: 0.5 },
      ],
    });
    assert(oobX.status === 400, 'Rejects out-of-bounds x coordinate > 1 (400)');

    // Out of bounds y < 0
    const oobY = await client.patch('/world/layout', {
      roomLayout: [
        { placementId: 'p1', itemId: 'small-wooden-bed', x: 0.5, y: -0.2 },
      ],
    });
    assert(oobY.status === 400, 'Rejects out-of-bounds y coordinate < 0 (400)');

    // Non-numeric coordinates
    const nonNum = await client.patch('/world/layout', {
      roomLayout: [
        { placementId: 'p1', itemId: 'small-wooden-bed', x: 'half', y: 0.5 },
      ],
    });
    assert(nonNum.status === 400, 'Rejects non-numeric coordinate (400)');
  }

  // ─── TEST 6: Ownership Protection ───
  console.log('\n📌 Test 6: Inventory Ownership Enforcement');
  {
    // Attempting to place an unowned item
    const unownedRes = await client.patch('/world/layout', {
      roomLayout: [
        { placementId: 'hacker-1', itemId: 'cloud-wallpaper', x: 0.5, y: 0.5 },
      ],
    });
    assert(unownedRes.status === 403, 'Rejects placement of unowned item with 403 Forbidden');
    assert(unownedRes.data.message.includes('do not own item'), 'Returns descriptive error message');
  }

  // ─── TEST 7: Capacity Limit Enforcement (Max 30 items) ───
  console.log('\n📌 Test 7: Maximum Capacity Limit Enforcement');
  {
    const oversizedLayout = [];
    for (let i = 0; i < 35; i++) {
      oversizedLayout.push({
        placementId: `item-${i}`,
        itemId: 'small-wooden-bed',
        x: 0.5,
        y: 0.5,
      });
    }

    const capacityRes = await client.patch('/world/layout', { roomLayout: oversizedLayout });
    assert(capacityRes.status === 400, 'Rejects exceeding room capacity > 30 items (400)');
  }

  // ─── TEST 8: Theme Updates ───
  console.log('\n📌 Test 8: Room Theme Customization');
  {
    const themeRes = await client.patch('/world/theme', { roomTheme: 'cloud' });
    assert(themeRes.status === 200, 'PATCH /world/theme succeeds with 200');
    assert(themeRes.data.world.roomTheme === 'cloud', 'Theme updated to cloud');

    const freshGet = await client.get('/world');
    assert(freshGet.data.world.roomTheme === 'cloud', 'Theme change persists');
  }

  // ─── TEST 9: Balcony Layout Isolation (Room furniture NOT carried over to Balcony) ───
  console.log('\n📌 Test 9: Balcony Layout Isolation & Separate Placement');
  {
    const worldBefore = await client.get('/world');
    const roomCountBefore = worldBefore.data.world.roomLayout.length;
    assert(Array.isArray(worldBefore.data.world.balconyLayout), 'balconyLayout starts as an empty array');
    assert(worldBefore.data.world.balconyLayout.length === 0, 'Balcony has 0 items initially');

    // Place a potted plant on the balcony deck
    const balconyItem = {
      placementId: `balcony-plant-${ts}`,
      itemId: 'potted-plant',
      x: 0.50,
      y: 0.65,
      rotation: 0,
      layer: 1,
    };

    const balconyPatch = await client.patch('/world/layout', {
      scene: 'balcony',
      balconyLayout: [balconyItem],
    });
    assert(balconyPatch.status === 200, 'PATCH /world/layout for balcony succeeds with 200');
    assert(balconyPatch.data.balconyLayout.length === 1, 'Balcony layout contains exactly 1 item');

    // Verify fresh GET: Room layout is completely unchanged!
    const worldAfter = await client.get('/world');
    assert(worldAfter.data.world.roomLayout.length === roomCountBefore, 'Room layout is NOT contaminated by balcony items');
    assert(worldAfter.data.world.balconyLayout.length === 1, 'Balcony layout persists independently');
    assert(worldAfter.data.world.balconyLayout[0].itemId === 'potted-plant', 'Balcony has potted-plant');
  }

  // ─── TEST 10: Balcony Views: 1 Free View & Remaining Views Unlockable ───
  console.log('\n📌 Test 10: Balcony Views (1 Free Default + Unlockable Views)');
  {
    const worldRes = await client.get('/world');
    const unlocked = worldRes.data.world.unlockedBalconyViews;
    assert(Array.isArray(unlocked), 'unlockedBalconyViews is an array');
    assert(unlocked.includes('sunset'), 'Sunset view is free and unlocked by default');
    assert(!unlocked.includes('cherry-blossom'), 'Cherry Blossom view is locked initially');

    // Attempting to set locked balcony view is blocked with 403
    const lockedPatch = await client.patch('/world/theme', { balconyView: 'cherry-blossom' });
    assert(lockedPatch.status === 403, 'Rejects switching to locked balcony view with 403');
    assert(lockedPatch.data.message.includes('locked'), 'Error specifies view is locked');

    // Unlock Cherry Blossom view via /world/unlock-balcony-view
    const unlockRes = await client.post('/world/unlock-balcony-view', { viewId: 'cherry-blossom' });
    // User Maya has level 1, cherry-blossom requires level 2
    if (unlockRes.status === 403) {
      assert(unlockRes.data.message.includes('Level'), 'Enforces level requirement for locked views');
    } else {
      assert(unlockRes.status === 200, 'Unlocked balcony view successfully');
      assert(unlockRes.data.unlockedBalconyViews.includes('cherry-blossom'), 'Added to unlockedBalconyViews');
    }
  }

  console.log(`\n🎉 Room Scene Test Suite Completed: ${passedTests}/${totalTests} tests passed!\n`);
}

runRoomTests().catch((err) => {
  console.error('\n❌ Room test suite failed:', err);
  process.exit(1);
});
