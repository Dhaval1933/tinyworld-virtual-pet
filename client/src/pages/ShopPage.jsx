import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { shopService } from '../services';
import { FurnitureIllustration } from '../components/room/RoomIllustrations';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import { ShoppingBag, Coins, Star, Check, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const categoryLabels = {
  all: 'All',
  furniture: 'Furniture',
  plants: 'Plants',
  decorations: 'Decor',
  wallpaper: 'Wallpaper',
  flooring: 'Flooring',
  food: 'Food',
};

const rarityStyles = {
  common: {
    badge: 'bg-cream text-ink-muted border-cream-dark',
    border: 'border-cream-dark hover:border-lavender',
  },
  uncommon: {
    badge: 'bg-sage/25 text-sage-dark border-sage/40',
    border: 'border-sage/40 hover:border-sage-dark',
  },
  rare: {
    badge: 'bg-lavender/30 text-lavender-dark border-lavender/50',
    border: 'border-lavender/50 hover:border-lavender-dark',
  },
};

export default function ShopPage() {
  const { user, updateUser } = useAuth();
  const { inventory, fetchInventory } = useGame();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  const loadShop = async () => {
    try {
      const data = await shopService.getItems();
      setItems(data.items);
    } catch {
      toast.error('Failed to load shop');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShop();
    fetchInventory();
  }, []);

  const handlePurchase = async (item) => {
    setPurchasing(true);
    try {
      const data = await shopService.purchase(item.itemId);
      toast.success(data.message || `Purchased ${item.name}!`);

      if (data.newBalance !== undefined) {
        updateUser({ ...user, coins: data.newBalance });
      }

      await fetchInventory();

      // Trigger celebration if an achievement was unlocked by this purchase
      if (data.unlockedAchievements && data.unlockedAchievements.length > 0) {
        data.unlockedAchievements.forEach((ach) => {
          toast(`🏆 Achievement Unlocked: ${ach.name}!`, {
            icon: '✨',
            duration: 4500,
          });
        });
      }

      setSelectedItem(null);
    } catch (err) {
      toast.error(err.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  const filteredItems =
    category === 'all' ? items : items.filter((i) => i.category === category);
  const ownedSet = new Set(inventory.map((inv) => inv.itemId));

  if (loading) return <Loading message="Loading shop catalog..." />;

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 p-5 rounded-3xl border border-cream-dark shadow-soft">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-peach-dark" />
            Cozy Item Shop
          </h1>
          <p className="text-xs text-ink-muted">
            Decorate your pet's room with cute furniture, plants, and wallpapers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-cream rounded-2xl px-4 py-2 border border-cream-dark">
            <Coins className="w-4 h-4 text-peach-dark" />
            <span className="font-bold text-base text-ink">{user?.coins ?? 0}</span>
            <span className="text-xs text-ink-muted">coins</span>
          </div>
          <div className="flex items-center gap-1.5 bg-lavender/30 rounded-2xl px-3.5 py-2 border border-lavender/40 text-xs font-bold text-ink">
            <Star className="w-3.5 h-3.5 text-lavender-dark" />
            Lv. {user?.level ?? 1}
          </div>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              category === key
                ? 'bg-lavender-dark text-white shadow-soft'
                : 'bg-white text-ink-muted hover:text-ink border border-cream-dark'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const owned = ownedSet.has(item.itemId);
          const locked = item.unlockRequirements?.level > (user?.level || 1);
          const style = rarityStyles[item.rarity] || rarityStyles.common;

          return (
            <div
              key={item.itemId}
              onClick={() => !locked && setSelectedItem(item)}
              className={`relative rounded-3xl border-2 p-4 flex flex-col items-center text-center transition-all bg-white hover:-translate-y-1 hover:shadow-card ${
                style.border
              } ${locked ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Owned badge */}
              {owned && !item.stackable && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-success flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              {/* Level Locked badge */}
              {locked && (
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-ink/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3" />
                  Lv. {item.unlockRequirements.level}
                </div>
              )}

              {/* Vector SVG Illustration */}
              <div className="w-18 h-18 my-2 flex items-center justify-center">
                <FurnitureIllustration
                  assetKey={item.assetKey}
                  itemId={item.itemId}
                  className="w-16 h-16 drop-shadow-sm"
                />
              </div>

              {/* Item Info */}
              <h3 className="font-bold text-sm text-ink truncate w-full mb-1">
                {item.name}
              </h3>

              <div className="flex items-center gap-1.5 mb-2.5">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${style.badge}`}>
                  {item.rarity}
                </span>
              </div>

              {/* Price */}
              <div className="mt-auto flex items-center justify-center gap-1.5 bg-cream/70 rounded-xl px-3 py-1 w-full border border-cream-dark">
                <Coins className="w-3.5 h-3.5 text-peach-dark" />
                <span className="text-sm font-bold text-ink">{item.price}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Purchase Confirmation Modal ─── */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Shop Details"
      >
        {selectedItem && (
          <div className="text-center">
            {/* SVG Illustration Preview */}
            <div className="w-24 h-24 mx-auto mb-3 flex items-center justify-center">
              <FurnitureIllustration
                assetKey={selectedItem.assetKey}
                itemId={selectedItem.itemId}
                className="w-20 h-20 drop-shadow-md"
              />
            </div>

            <h3 className="font-display font-bold text-xl text-ink">
              {selectedItem.name}
            </h3>

            <div className="flex items-center justify-center gap-2 mt-1 mb-3">
              <span className="text-xs font-semibold capitalize text-ink-muted">
                {selectedItem.rarity} • {selectedItem.category}
              </span>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed px-4 mb-4">
              {selectedItem.description}
            </p>

            {/* Price Pill */}
            <div className="flex items-center justify-center gap-2 bg-cream rounded-2xl p-3 border border-cream-dark mb-4">
              <Coins className="w-5 h-5 text-peach-dark" />
              <span className="font-bold text-lg text-ink">
                {selectedItem.price} coins
              </span>
            </div>

            {/* Insufficient funds warning */}
            {(user?.coins || 0) < selectedItem.price && (
              <p className="text-xs font-semibold text-danger-dark mb-4">
                You need {selectedItem.price - (user?.coins || 0)} more coins to purchase this.
              </p>
            )}

            {/* Modal Actions */}
            <div className="flex gap-3 mt-5">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedItem(null)}
              >
                Cancel
              </Button>

              {ownedSet.has(selectedItem.itemId) && !selectedItem.stackable ? (
                <Button variant="secondary" className="flex-1" disabled>
                  Already Owned
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  variant="primary"
                  onClick={() => handlePurchase(selectedItem)}
                  loading={purchasing}
                  disabled={(user?.coins || 0) < selectedItem.price}
                  icon={ShoppingBag}
                >
                  Confirm Buy
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
