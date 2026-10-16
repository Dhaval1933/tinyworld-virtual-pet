import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { shopService } from '../services';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
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
  common: 'border-ink-muted/20 bg-cream/50',
  uncommon: 'border-success/30 bg-success/5',
  rare: 'border-lavender/50 bg-lavender/10',
};

const itemEmojis = {
  'bed': '🛏️', 'sofa': '🛋️', 'desk': '📝', 'bookshelf': '📚',
  'armchair': '💺', 'potted-plant': '🌿', 'hanging-ivy': '🌿',
  'succulents': '🪴', 'rug': '🟤', 'star-lamp': '⭐',
  'curtains': '🪟', 'photo-frame': '🖼️', 'cloud-wall': '☁️',
  'forest-wall': '🌲', 'wood-floor': '🪵', 'stone-floor': '🧱',
  'strawberry': '🍓', 'toast': '🍞',
};

export default function ShopPage() {
  const { user, updateUser } = useAuth();
  const { inventory, fetchInventory } = useGame();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadShop();
    fetchInventory();
  }, []);

  const loadShop = async () => {
    try {
      const data = await shopService.getItems();
      setItems(data.items);
    } catch (err) {
      toast.error('Failed to load shop');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (item) => {
    setPurchasing(true);
    try {
      const data = await shopService.purchase(item.itemId);
      toast.success(data.message);
      updateUser({ ...user, coins: data.newBalance });
      await fetchInventory();
      setSelectedItem(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPurchasing(false);
    }
  };

  const filteredItems = category === 'all' ? items : items.filter((i) => i.category === category);
  const ownedSet = new Set(inventory.map((inv) => inv.itemId));

  if (loading) return <Loading message="Loading shop..." />;

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-peach-dark" />
            Shop
          </h1>
          <p className="text-sm text-ink-muted">Buy furniture, plants, decorations and more</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white rounded-xl px-4 py-2 shadow-soft">
          <Coins className="w-4 h-4 text-peach-dark" />
          <span className="font-bold text-ink">{user?.coins ?? 0}</span>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              category === key
                ? 'bg-lavender-dark text-white shadow-soft'
                : 'bg-white text-ink-muted hover:bg-lavender/20'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const owned = ownedSet.has(item.itemId);
          const locked = item.unlockRequirements?.level > (user?.level || 1);
          const emoji = itemEmojis[item.assetKey] || '📦';
          
          return (
            <div
              key={item.itemId}
              onClick={() => !locked && setSelectedItem(item)}
              className={`relative rounded-2xl border-2 p-4 text-center cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-card ${
                rarityStyles[item.rarity] || rarityStyles.common
              } ${locked ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {owned && !item.stackable && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-success flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              {locked && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-4 h-4 text-ink-muted" />
                </div>
              )}
              <div className="text-3xl mb-2">{emoji}</div>
              <p className="font-semibold text-sm text-ink truncate">{item.name}</p>
              <p className="text-xs capitalize text-ink-muted">{item.rarity}</p>
              <div className="flex items-center justify-center gap-1 mt-1.5">
                <Coins className="w-3 h-3 text-peach-dark" />
                <span className="text-sm font-bold text-ink">{item.price}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Purchase Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Item Details"
      >
        {selectedItem && (
          <div className="text-center">
            <div className="text-5xl mb-3">{itemEmojis[selectedItem.assetKey] || '📦'}</div>
            <h3 className="font-display font-bold text-xl text-ink">{selectedItem.name}</h3>
            <p className="text-sm text-ink-muted mt-1 capitalize">{selectedItem.rarity} · {selectedItem.category}</p>
            <p className="text-sm text-ink-muted mt-3">{selectedItem.description}</p>
            
            <div className="flex items-center justify-center gap-2 mt-4 bg-cream rounded-xl p-3">
              <Coins className="w-5 h-5 text-peach-dark" />
              <span className="font-bold text-lg text-ink">{selectedItem.price} coins</span>
            </div>

            {(user?.coins || 0) < selectedItem.price && (
              <p className="text-sm text-danger-dark mt-2">
                You need {selectedItem.price - (user?.coins || 0)} more coins
              </p>
            )}

            <div className="flex gap-3 mt-6">
              <Button variant="ghost" className="flex-1" onClick={() => setSelectedItem(null)}>
                Cancel
              </Button>
              {ownedSet.has(selectedItem.itemId) && !selectedItem.stackable ? (
                <Button variant="secondary" className="flex-1" disabled>
                  Already Owned
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  onClick={() => handlePurchase(selectedItem)}
                  loading={purchasing}
                  disabled={(user?.coins || 0) < selectedItem.price}
                  icon={ShoppingBag}
                >
                  Buy
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
