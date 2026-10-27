import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const onboardingService = {
  complete: (data) => api.post('/onboarding/complete', data),
};

export const petService = {
  getPet: () => api.get('/pet'),
  updateName: (name) => api.patch('/pet/name', { name }),
  feed: () => api.post('/pet/feed'),
  pet: () => api.post('/pet/pet'),
  rest: () => api.post('/pet/rest'),
  chat: (message, history = []) => api.post('/pet/chat', { message, history }),
};

export const worldService = {
  getWorld: () => api.get('/world'),
  updateLayout: (layoutData, scene = 'room') => {
    if (layoutData && (layoutData.roomLayout || layoutData.balconyLayout)) {
      return api.patch('/world/layout', layoutData);
    }
    return api.patch('/world/layout', {
      [scene === 'balcony' ? 'balconyLayout' : 'roomLayout']: layoutData,
      scene,
    });
  },
  updateTheme: (data) => api.patch('/world/theme', data),
  unlockBalconyView: (viewId) => api.post('/world/unlock-balcony-view', { viewId }),
};

export const shopService = {
  getItems: (category) => api.get('/shop', { params: { category } }),
  getInventory: () => api.get('/shop/inventory'),
  purchase: (itemId) => api.post('/shop/purchase', { itemId }),
};

export const activityService = {
  getTypes: () => api.get('/activities'),
  complete: (data) => api.post('/activities/complete', data),
  getHistory: (page = 1) => api.get('/activities/history', { params: { page } }),
  getSummary: () => api.get('/activities/summary'),
};

export const progressService = {
  getProgress: () => api.get('/progress'),
  getAchievements: () => api.get('/progress/achievements'),
};

export const userService = {
  updateProfile: (data) => api.patch('/users/me', data),
  changePassword: (data) => api.patch('/users/change-password', data),
};

export const subscriptionService = {
  createOrder: () => api.post('/subscription/create-order'),
  verifyPayment: (data) => api.post('/subscription/verify-payment', data),
  getStatus: () => api.get('/subscription/status'),
};

