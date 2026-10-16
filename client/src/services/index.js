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
};

export const worldService = {
  getWorld: () => api.get('/world'),
  updateLayout: (roomLayout) => api.patch('/world/layout', { roomLayout }),
  updateTheme: (data) => api.patch('/world/theme', data),
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
};
