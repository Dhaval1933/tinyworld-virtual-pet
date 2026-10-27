/**
 * End-to-End Automated Verification Script for Auth & Onboarding (using Node native fetch)
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

// Client wrapper to handle cookies automatically
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

    // Capture set-cookie
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

async function runTests() {
  console.log('\n🧪 Starting TinyWorld Auth & Onboarding End-to-End Test Suite...\n');

  const timestamp = Date.now();
  const userA = {
    displayName: 'Alice Wonderland',
    email: `alice_${timestamp}@tinyworld.test`,
    password: 'AliceCozyPassword123!',
    username: `alice_${timestamp}`,
  };

  const userB = {
    displayName: 'Bob Builder',
    email: `bob_${timestamp}@tinyworld.test`,
    password: 'BobCozyPassword123!',
    username: `bob_${timestamp}`,
  };

  const clientA = new TestClient();
  const clientB = new TestClient();

  // ─── TEST 1: Input Validation on Registration ───
  console.log('📌 Test 1: Registration Input Validation');
  {
    const badEmailRes = await clientA.post('/auth/register', {
      displayName: 'A',
      email: 'not-an-email',
      password: '123',
    });
    assert(badEmailRes.status === 400, 'Rejects invalid email and short password (400)');
    assert(badEmailRes.data.success === false, 'Returns success: false');
  }

  // ─── TEST 2: Successful Registration for User A ───
  console.log('\n📌 Test 2: Successful Registration & Cookie Issuance');
  {
    const regRes = await clientA.post('/auth/register', userA);
    assert(regRes.status === 201, 'User A registered with 201 Created');
    assert(regRes.data.user.email === userA.email, 'User profile returned matching email');
    assert(regRes.data.user.passwordHash === undefined, 'Password hash is NOT exposed in response');
    assert(clientA.cookie.startsWith('token='), 'HTTP-only auth token cookie received');
  }

  // ─── TEST 3: Login Verification ───
  console.log('\n📌 Test 3: Login Verification');
  {
    // Bad password
    const badLogin = await clientA.post('/auth/login', {
      email: userA.email,
      password: 'WrongPassword!',
    });
    assert(badLogin.status === 401, 'Rejects incorrect password with 401 Unauthorized');

    // Correct password
    const goodLogin = await clientA.post('/auth/login', {
      email: userA.email,
      password: userA.password,
    });
    assert(goodLogin.status === 200, 'Logs in successfully with 200 OK');
    assert(goodLogin.data.user.displayName === userA.displayName, 'User display name is correct');
  }

  // ─── TEST 4: Current User Session (/auth/me) ───
  console.log('\n📌 Test 4: Current User Retrieval (/auth/me)');
  {
    const meRes = await clientA.get('/auth/me');
    assert(meRes.status === 200, '/auth/me returns 200 OK');
    assert(meRes.data.user.email === userA.email, 'Returns authenticated user info');
    assert(meRes.data.user.onboardingCompleted === false, 'User onboardingCompleted starts false');
  }

  // ─── TEST 5: Onboarding Flow ───
  console.log('\n📌 Test 5: Onboarding Completion (Pet, Room & Inventory Creation)');
  {
    // Validation: invalid pet species
    const badSpecies = await clientA.post('/onboarding/complete', {
      petSpecies: 'dragon',
      petName: 'Draco',
      roomTheme: 'cozy',
    });
    assert(badSpecies.status === 400, 'Rejects invalid pet species with 400');

    // Valid onboarding
    const onboardRes = await clientA.post('/onboarding/complete', {
      petSpecies: 'mochi',
      petName: 'MochiCat',
      roomTheme: 'cozy',
      focusCategory: 'learning',
    });

    assert(onboardRes.status === 201, 'Onboarding completed with 201 Created');
    assert(onboardRes.data.pet.name === 'MochiCat', 'Pet created with chosen name');
    assert(onboardRes.data.pet.species === 'mochi', 'Pet created with chosen species');
    assert(onboardRes.data.world.roomTheme === 'cozy', 'World created with cozy theme');
    assert(onboardRes.data.user.onboardingCompleted === true, 'User marked onboardingCompleted: true');
    assert(onboardRes.data.user.coins === 200, 'User awarded 200 starter coins');

    // Prevent re-onboarding
    const duplicateOnboard = await clientA.post('/onboarding/complete', {
      petSpecies: 'pebble',
      petName: 'Duplicate',
    });
    assert(duplicateOnboard.status === 400, 'Prevents duplicate onboarding with 400');
  }

  // ─── TEST 6: User Data Isolation ───
  console.log('\n📌 Test 6: User Data Isolation & Ownership Protection');
  {
    // Register User B
    const regB = await clientB.post('/auth/register', userB);
    assert(regB.status === 201, 'User B registered successfully');

    // Onboard User B with different pet and room
    const onboardB = await clientB.post('/onboarding/complete', {
      petSpecies: 'pebble',
      petName: 'PebbleBunny',
      roomTheme: 'forest',
    });
    assert(onboardB.status === 201, 'User B onboarded successfully');

    // Fetch Pet for User A vs User B
    const petA = await clientA.get('/pet');
    const petB = await clientB.get('/pet');

    assert(petA.data.pet.name === 'MochiCat', 'User A sees their own pet MochiCat');
    assert(petB.data.pet.name === 'PebbleBunny', 'User B sees their own pet PebbleBunny');
    assert(petA.data.pet.name !== petB.data.pet.name, 'Pets are isolated between users');

    // Fetch World for User A vs User B
    const worldA = await clientA.get('/world');
    const worldB = await clientB.get('/world');

    assert(worldA.data.world.roomTheme === 'cozy', 'User A world is cozy');
    assert(worldB.data.world.roomTheme === 'forest', 'User B world is forest');

    // Test Item Ownership Protection: User B tries to place an unowned item in their room
    const unauthorizedPlace = await clientB.patch('/world/layout', {
      roomLayout: [
        {
          placementId: 'fake-item-123',
          itemId: 'super-rare-golden-throne', // Not in User B's inventory!
          x: 0.5,
          y: 0.5,
        },
      ],
    });
    assert(unauthorizedPlace.status === 403, 'Rejects placing unowned item with 403 Forbidden');
  }

  // ─── TEST 7: Session Persistence ───
  console.log('\n📌 Test 7: Session Persistence Across Requests');
  {
    // Simulating page refresh by creating a new client carrying User A's cookie
    const refreshClient = new TestClient();
    refreshClient.cookie = clientA.cookie;

    const refreshedMe = await refreshClient.get('/auth/me');
    assert(refreshedMe.status === 200, 'Session persists across distinct requests');
    assert(refreshedMe.data.user.email === userA.email, 'Preserves correct identity');
    assert(refreshedMe.data.user.onboardingCompleted === true, 'Preserves onboarding status');
  }

  // ─── TEST 8: Logout & Token Invalidation ───
  console.log('\n📌 Test 8: Logout Flow & Protected Route Guards');
  {
    const logoutRes = await clientA.post('/auth/logout');
    assert(logoutRes.status === 200, 'Logout succeeds with 200 OK');

    // Verify token is cleared in cookie header
    const setCookie = logoutRes.headers.get('set-cookie');
    assert(setCookie && setCookie.includes('token=;'), 'Token cookie cleared/expired');

    // Attempting protected endpoint after logout without token
    const unauthClient = new TestClient();
    const blockedRes = await unauthClient.get('/pet');
    assert(blockedRes.status === 401, 'Unauthenticated request correctly blocked with 401');

    const blockedMe = await unauthClient.get('/auth/me');
    assert(blockedMe.status === 401, '/auth/me returns 401 when logged out');
  }

  // ─── TEST 9: Password Change Flow & Security ───
  console.log('\n📌 Test 9: Password Change Flow & Security');
  {
    const changeClient = new TestClient();
    await changeClient.post('/auth/login', { email: userB.email, password: userB.password });

    // Wrong current password
    const wrongRes = await changeClient.patch('/users/change-password', {
      currentPassword: 'WrongPassword!',
      newPassword: 'BrandNewPassword123!',
    });
    assert(wrongRes.status === 401, 'Rejects incorrect current password with 401');

    // Too short new password
    const shortRes = await changeClient.patch('/users/change-password', {
      currentPassword: userB.password,
      newPassword: 'short',
    });
    assert(shortRes.status === 400, 'Rejects short new password with 400');

    // Valid change
    const validRes = await changeClient.patch('/users/change-password', {
      currentPassword: userB.password,
      newPassword: 'BrandNewPassword123!',
    });
    assert(validRes.status === 200, 'Password updated successfully with 200 OK');

    // Test logging in with old password fails
    const oldLogin = await new TestClient().post('/auth/login', { email: userB.email, password: userB.password });
    assert(oldLogin.status === 401, 'Old password no longer works (401)');

    // Test logging in with new password succeeds
    const newLogin = await new TestClient().post('/auth/login', { email: userB.email, password: 'BrandNewPassword123!' });
    assert(newLogin.status === 200, 'New password logs in successfully (200)');
  }

  console.log(`\n🎉 Test Suite Completed: ${passedTests}/${totalTests} tests passed!\n`);
}

runTests().catch((err) => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
