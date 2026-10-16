/**
 * Seed script — populates shop items and achievements.
 * Run: npm run seed
 * 
 * Uses upsert to prevent duplicates on re-runs.
 */
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const ShopItem = require('../src/models/ShopItem');
const Achievement = require('../src/models/Achievement');

const SHOP_ITEMS = [
  // ─── Furniture ───
  {
    itemId: 'small-wooden-bed',
    name: 'Small Wooden Bed',
    category: 'furniture',
    description: 'A cozy little bed for your pet to rest.',
    price: 50,
    rarity: 'common',
    assetKey: 'bed',
    itemType: 'placeable',
    stackable: false,
    unlockRequirements: { level: 1 },
  },
  {
    itemId: 'pastel-sofa',
    name: 'Pastel Sofa',
    category: 'furniture',
    description: 'A comfy sofa in soft pastel colors.',
    price: 120,
    rarity: 'uncommon',
    assetKey: 'sofa',
    itemType: 'placeable',
    stackable: false,
    unlockRequirements: { level: 2 },
  },
  {
    itemId: 'desk-and-chair',
    name: 'Desk & Chair',
    category: 'furniture',
    description: 'A sturdy desk with a matching chair.',
    price: 100,
    rarity: 'common',
    assetKey: 'desk',
    itemType: 'placeable',
    stackable: false,
    unlockRequirements: { level: 1 },
  },
  {
    itemId: 'bookshelf',
    name: 'Bookshelf',
    category: 'furniture',
    description: 'Perfect for organizing your favorite reads.',
    price: 80,
    rarity: 'common',
    assetKey: 'bookshelf',
    itemType: 'placeable',
    stackable: false,
    unlockRequirements: { level: 1 },
  },
  {
    itemId: 'cozy-armchair',
    name: 'Cozy Armchair',
    category: 'furniture',
    description: 'Sink in and relax.',
    price: 90,
    rarity: 'common',
    assetKey: 'armchair',
    itemType: 'placeable',
    stackable: false,
    unlockRequirements: { level: 2 },
  },

  // ─── Plants ───
  {
    itemId: 'potted-plant',
    name: 'Potted Plant',
    category: 'plants',
    description: 'A cheerful little green companion.',
    price: 30,
    rarity: 'common',
    assetKey: 'potted-plant',
    itemType: 'placeable',
    stackable: false,
    unlockRequirements: { level: 1 },
  },
  {
    itemId: 'hanging-ivy',
    name: 'Hanging Ivy',
    category: 'plants',
    description: 'Cascading greenery for your walls.',
    price: 60,
    rarity: 'uncommon',
    assetKey: 'hanging-ivy',
    itemType: 'placeable',
    stackable: false,
    unlockRequirements: { level: 3 },
  },
  {
    itemId: 'succulent-trio',
    name: 'Succulent Trio',
    category: 'plants',
    description: 'Three tiny succulents in colorful pots.',
    price: 45,
    rarity: 'common',
    assetKey: 'succulents',
    itemType: 'placeable',
    stackable: false,
    unlockRequirements: { level: 1 },
  },

  // ─── Decorations ───
  {
    itemId: 'round-rug',
    name: 'Round Rug',
    category: 'decorations',
    description: 'A soft circular rug in warm tones.',
    price: 40,
    rarity: 'common',
    assetKey: 'rug',
    itemType: 'placeable',
    stackable: false,
    unlockRequirements: { level: 1 },
  },
  {
    itemId: 'star-lamp',
    name: 'Star Lamp',
    category: 'decorations',
    description: 'A glowing star-shaped lamp. Magical!',
    price: 75,
    rarity: 'uncommon',
    assetKey: 'star-lamp',
    itemType: 'placeable',
    stackable: false,
    unlockRequirements: { level: 2 },
  },
  {
    itemId: 'window-curtains',
    name: 'Window Curtains',
    category: 'decorations',
    description: 'Flowy curtains that let the sunlight in.',
    price: 55,
    rarity: 'common',
    assetKey: 'curtains',
    itemType: 'placeable',
    stackable: false,
    unlockRequirements: { level: 1 },
  },
  {
    itemId: 'photo-frame',
    name: 'Photo Frame',
    category: 'decorations',
    description: 'A cute frame to display memories.',
    price: 35,
    rarity: 'common',
    assetKey: 'photo-frame',
    itemType: 'placeable',
    stackable: false,
    unlockRequirements: { level: 1 },
  },

  // ─── Wallpaper ───
  {
    itemId: 'cloud-wallpaper',
    name: 'Cloud Wallpaper',
    category: 'wallpaper',
    description: 'Soft clouds drifting across the sky.',
    price: 150,
    rarity: 'rare',
    assetKey: 'cloud-wall',
    itemType: 'theme',
    stackable: false,
    unlockRequirements: { level: 3 },
  },
  {
    itemId: 'forest-wallpaper',
    name: 'Forest Wallpaper',
    category: 'wallpaper',
    description: 'Tall trees and dappled sunlight.',
    price: 150,
    rarity: 'rare',
    assetKey: 'forest-wall',
    itemType: 'theme',
    stackable: false,
    unlockRequirements: { level: 3 },
  },

  // ─── Flooring ───
  {
    itemId: 'wooden-flooring',
    name: 'Wooden Flooring',
    category: 'flooring',
    description: 'Warm wooden planks underfoot.',
    price: 100,
    rarity: 'uncommon',
    assetKey: 'wood-floor',
    itemType: 'theme',
    stackable: false,
    unlockRequirements: { level: 2 },
  },
  {
    itemId: 'stone-flooring',
    name: 'Stone Flooring',
    category: 'flooring',
    description: 'Cool cobblestones for a rustic feel.',
    price: 100,
    rarity: 'uncommon',
    assetKey: 'stone-floor',
    itemType: 'theme',
    stackable: false,
    unlockRequirements: { level: 2 },
  },

  // ─── Food ───
  {
    itemId: 'strawberry-snack',
    name: 'Strawberry Snack',
    category: 'food',
    description: 'A sweet treat for your pet.',
    price: 10,
    rarity: 'common',
    assetKey: 'strawberry',
    itemType: 'consumable',
    stackable: true,
    unlockRequirements: { level: 1 },
  },
  {
    itemId: 'honey-toast',
    name: 'Honey Toast',
    category: 'food',
    description: 'Warm toast drizzled with golden honey.',
    price: 15,
    rarity: 'common',
    assetKey: 'toast',
    itemType: 'consumable',
    stackable: true,
    unlockRequirements: { level: 1 },
  },
];

const ACHIEVEMENTS = [
  {
    achievementId: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first activity.',
    iconKey: 'footprints',
    requirementType: 'first_activity',
    requirementValue: 1,
    rewardCoins: 25,
  },
  {
    achievementId: 'cozy-corner',
    name: 'Cozy Corner',
    description: 'Place your first decoration in your room.',
    iconKey: 'sparkles',
    requirementType: 'first_decoration',
    requirementValue: 1,
    rewardCoins: 25,
  },
  {
    achievementId: 'little-collector',
    name: 'Little Collector',
    description: 'Own 5 unique items.',
    iconKey: 'package',
    requirementType: 'items_owned',
    requirementValue: 5,
    rewardCoins: 50,
  },
  {
    achievementId: 'getting-into-it',
    name: 'Getting Into It',
    description: 'Complete 5 activities.',
    iconKey: 'flame',
    requirementType: 'activities_completed',
    requirementValue: 5,
    rewardCoins: 50,
  },
  {
    achievementId: 'room-designer',
    name: 'Room Designer',
    description: 'Decorate your room with 5 objects.',
    iconKey: 'palette',
    requirementType: 'items_placed',
    requirementValue: 5,
    rewardCoins: 50,
  },
  {
    achievementId: 'dedicated',
    name: 'Dedicated',
    description: 'Complete 20 activities.',
    iconKey: 'trophy',
    requirementType: 'activities_completed',
    requirementValue: 20,
    rewardCoins: 100,
  },
  {
    achievementId: 'shopaholic',
    name: 'Shopaholic',
    description: 'Make your first purchase from the shop.',
    iconKey: 'shopping-bag',
    requirementType: 'first_purchase',
    requirementValue: 1,
    rewardCoins: 25,
  },
  {
    achievementId: 'level-5',
    name: 'Rising Star',
    description: 'Reach level 5.',
    iconKey: 'star',
    requirementType: 'level_reached',
    requirementValue: 5,
    rewardCoins: 100,
  },
];

async function seed() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    // Upsert shop items (idempotent)
    console.log('🛍️  Seeding shop items...');
    for (const item of SHOP_ITEMS) {
      await ShopItem.findOneAndUpdate(
        { itemId: item.itemId },
        item,
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log(`   ✅ ${SHOP_ITEMS.length} shop items seeded`);

    // Upsert achievements (idempotent)
    console.log('🏆 Seeding achievements...');
    for (const achievement of ACHIEVEMENTS) {
      await Achievement.findOneAndUpdate(
        { achievementId: achievement.achievementId },
        achievement,
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log(`   ✅ ${ACHIEVEMENTS.length} achievements seeded`);

    console.log('\n🎉 Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
