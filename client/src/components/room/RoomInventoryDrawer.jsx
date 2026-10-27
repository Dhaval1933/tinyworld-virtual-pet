import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FurnitureIllustration } from './RoomIllustrations';
import { X, Plus, Check, ShoppingBag, Sparkles } from 'lucide-react';
import Button from '../common/Button';

export default function RoomInventoryDrawer({
  isOpen,
  onClose,
  inventory = [],
  roomLayout = [],
  balconyLayout = [],
  activeScene = 'room',
  onPlaceItem,
}) {
  const [activeCategory, setActiveCategory] = useState('all');

  if (!isOpen) return null;

  // Filter placeable items
  const placeableItems = inventory.filter(
    (inv) => inv.item && inv.item.itemType === 'placeable'
  );

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'furniture', label: 'Furniture' },
    { id: 'plants', label: 'Plants' },
    { id: 'decorations', label: 'Decorations' },
  ];

  const filteredItems = placeableItems.filter((inv) => {
    if (activeCategory === 'all') return true;
    return inv.item?.category === activeCategory;
  });

  const isBalcony = activeScene === 'balcony';
  const currentSceneLayout = isBalcony ? balconyLayout : roomLayout;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/30 backdrop-blur-xs animate-pop-in">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-up sm:animate-none">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-cream-dark">
          <div>
            <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-lavender-dark" />
              {isBalcony ? 'Balcony Decor' : 'Room Inventory'}
            </h2>
            <p className="text-xs text-ink-muted">
              {isBalcony
                ? 'Tap an item to decorate your scenic outdoor terrace'
                : 'Tap an item to place it inside your room'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-cream transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 p-3 border-b border-cream-dark overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-lavender-dark text-white shadow-soft'
                  : 'bg-cream text-ink-muted hover:text-ink'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl">
                🛋️
              </div>
              <h3 className="font-display font-bold text-ink mb-1">No items found</h3>
              <p className="text-sm text-ink-muted mb-5">
                Visit the Shop to browse cozy furniture, lush plants, and cute decorations!
              </p>
              <Link to="/shop">
                <Button icon={ShoppingBag} size="sm">
                  Visit Item Shop
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredItems.map((inv) => {
                const placedInRoom = (roomLayout || []).filter((l) => l.itemId === inv.itemId).length;
                const placedOnBalcony = (balconyLayout || []).filter((l) => l.itemId === inv.itemId).length;
                const totalPlaced = placedInRoom + placedOnBalcony;
                const isStackable = inv.item?.stackable;
                const canPlace = isStackable || totalPlaced < (inv.quantity || 1);

                return (
                  <div
                    key={inv.itemId}
                    className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${
                      canPlace
                        ? 'border-cream-dark hover:border-lavender bg-white hover:shadow-card'
                        : 'border-cream-dark/50 bg-cream/40 opacity-60'
                    }`}
                  >
                    {/* SVG Illustration Preview */}
                    <div className="w-18 h-18 mb-2 flex items-center justify-center">
                      <FurnitureIllustration
                        assetKey={inv.item?.assetKey}
                        itemId={inv.itemId}
                        className="w-16 h-16 drop-shadow-sm"
                      />
                    </div>

                    <h4 className="font-bold text-sm text-ink truncate w-full mb-0.5">
                      {inv.item?.name || inv.itemId}
                    </h4>

                    {/* Quantity status badge */}
                    <div className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-ink-muted mb-3">
                      <div className="flex items-center gap-1">
                        <span>Owned: {inv.quantity || 1}</span>
                        <span>•</span>
                        <span>Placed: {totalPlaced}</span>
                      </div>
                      {totalPlaced > 0 && (
                        <span className="text-[10px] text-ink-muted/80">
                          ({placedInRoom > 0 ? `${placedInRoom} in room` : ''}
                          {placedInRoom > 0 && placedOnBalcony > 0 ? ', ' : ''}
                          {placedOnBalcony > 0 ? `${placedOnBalcony} on balcony` : ''})
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    {canPlace ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full text-xs py-1.5"
                        icon={Plus}
                        onClick={() => {
                          onPlaceItem(inv);
                          onClose();
                        }}
                      >
                        {isBalcony ? 'Place on Balcony' : 'Place in Room'}
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center gap-1 w-full py-1.5 bg-sage/20 text-sage-dark rounded-xl text-xs font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        {placedInRoom > 0 && placedOnBalcony === 0
                          ? 'In Room'
                          : placedOnBalcony > 0 && placedInRoom === 0
                          ? 'On Balcony'
                          : 'Placed'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cream-dark bg-cream/50 flex items-center justify-between">
          <span className="text-xs text-ink-muted">
            {isBalcony ? 'Balcony' : 'Room'} capacity: {currentSceneLayout.length}/30 items
          </span>
          <Link to="/shop">
            <Button variant="ghost" size="sm" icon={ShoppingBag}>
              Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
