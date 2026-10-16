import { useEffect, useState, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { useRoom } from '../context/RoomContext';
import { useAuth } from '../context/AuthContext';
import { petService } from '../services';
import Button from '../components/common/Button';
import ProgressBar from '../components/common/ProgressBar';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import { 
  Edit3, Eye, Plus, Trash2, RotateCw, Save,
  Heart, Zap, Cookie, Sparkles, Coins, Star,
  Hand, UtensilsCrossed, Moon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { generateId } from '../utils/formatters';

const petEmojis = { mochi: '😺', pebble: '🐰', sprout: '🌱' };

const itemEmojis = {
  'bed': '🛏️', 'sofa': '🛋️', 'desk': '📝', 'bookshelf': '📚',
  'armchair': '💺', 'potted-plant': '🌿', 'hanging-ivy': '🌿',
  'succulents': '🪴', 'rug': '🟤', 'star-lamp': '⭐',
  'curtains': '🪟', 'photo-frame': '🖼️', 'strawberry': '🍓',
  'toast': '🍞',
};

const roomThemeStyles = {
  cozy:   { wall: 'from-peach/20 to-cream', floor: 'bg-peach/15' },
  forest: { wall: 'from-sage/30 to-cream',  floor: 'bg-sage/15' },
  cloud:  { wall: 'from-sky/30 to-cream',   floor: 'bg-sky/10' },
  ocean:  { wall: 'from-sky/40 to-sky/10',  floor: 'bg-sky/15' },
};

export default function GameRoomPage() {
  const { user } = useAuth();
  const { pet, setPet, inventory, fetchPet, fetchInventory } = useGame();
  const { world, editMode, toggleEditMode, selectedItem, setSelectedItem, fetchWorld, updateLayout } = useRoom();
  
  const [pageLoading, setPageLoading] = useState(true);
  const [showInventory, setShowInventory] = useState(false);
  const [speechBubble, setSpeechBubble] = useState('');
  const [petAnimation, setPetAnimation] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const roomRef = useRef(null);
  const dragRef = useRef({ dragging: false, id: null, offsetX: 0, offsetY: 0 });

  // Load game data on mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchPet(), fetchInventory(), fetchWorld()]);
      setPageLoading(false);
    };
    loadData();
  }, []);

  // Pet speech bubbles
  const showSpeech = useCallback((msg, duration = 3000) => {
    setSpeechBubble(msg);
    setTimeout(() => setSpeechBubble(''), duration);
  }, []);

  const triggerPetAnim = useCallback((anim) => {
    setPetAnimation(anim);
    setTimeout(() => setPetAnimation(''), 600);
  }, []);

  // ─── Pet Interactions ───
  const handlePetClick = () => {
    const messages = [
      'Hello! ✨', 'I love this room! 🏠', 'Play with me! 💕',
      "Let's do something fun!", 'You\'re the best! 🌟', '*purrs happily*',
    ];
    showSpeech(messages[Math.floor(Math.random() * messages.length)]);
    triggerPetAnim('animate-wiggle');
  };

  const handleFeed = async () => {
    setActionLoading('feed');
    try {
      const data = await petService.feed();
      setPet(data.pet);
      showSpeech('Yummy! 🍽️');
      triggerPetAnim('animate-bounce-gentle');
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading('');
    }
  };

  const handlePetPet = async () => {
    setActionLoading('pet');
    try {
      const data = await petService.pet();
      setPet(data.pet);
      showSpeech('So happy! 💕');
      triggerPetAnim('animate-wiggle');
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading('');
    }
  };

  const handleRest = async () => {
    setActionLoading('rest');
    try {
      const data = await petService.rest();
      setPet(data.pet);
      showSpeech('Zzz... 😴');
      triggerPetAnim('animate-pulse-soft');
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading('');
    }
  };

  // ─── Drag & Drop ───
  const handlePointerDown = (e, placementId) => {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();

    const room = roomRef.current;
    if (!room) return;
    const rect = room.getBoundingClientRect();
    const item = world.roomLayout.find((i) => i.placementId === placementId);
    if (!item) return;

    const pixelX = item.x * rect.width;
    const pixelY = item.y * rect.height;

    dragRef.current = {
      dragging: true,
      id: placementId,
      offsetX: e.clientX - (rect.left + pixelX),
      offsetY: e.clientY - (rect.top + pixelY),
    };

    setSelectedItem(placementId);
    room.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.dragging) return;
    e.preventDefault();

    const room = roomRef.current;
    if (!room) return;
    const rect = room.getBoundingClientRect();

    const newX = (e.clientX - rect.left - dragRef.current.offsetX) / rect.width;
    const newY = (e.clientY - rect.top - dragRef.current.offsetY) / rect.height;

    const clampedX = Math.max(0, Math.min(1, newX));
    const clampedY = Math.max(0, Math.min(1, newY));

    const newLayout = world.roomLayout.map((item) =>
      item.placementId === dragRef.current.id
        ? { ...item, x: clampedX, y: clampedY }
        : item
    );
    updateLayout(newLayout);
  };

  const handlePointerUp = () => {
    dragRef.current.dragging = false;
  };

  // ─── Room Item Management ───
  const handlePlaceItem = (invItem) => {
    if (!world) return;
    const existingCount = world.roomLayout.filter((l) => l.itemId === invItem.itemId).length;
    const isStackable = invItem.item?.stackable;
    
    if (!isStackable && existingCount >= 1) {
      toast.error('This item is already placed in the room.');
      return;
    }
    if (!isStackable && existingCount >= invItem.quantity) {
      toast.error('All copies of this item are already placed.');
      return;
    }
    if (world.roomLayout.length >= 30) {
      toast.error('Room is full! (max 30 items)');
      return;
    }

    const newItem = {
      placementId: generateId(),
      itemId: invItem.itemId,
      x: 0.3 + Math.random() * 0.4,
      y: 0.3 + Math.random() * 0.4,
      rotation: 0,
      layer: world.roomLayout.length,
    };

    updateLayout([...world.roomLayout, newItem]);
    toast.success(`Placed ${invItem.item?.name || invItem.itemId}!`);
  };

  const handleRotateItem = (placementId) => {
    const newLayout = world.roomLayout.map((i) =>
      i.placementId === placementId
        ? { ...i, rotation: ((i.rotation || 0) + 45) % 360 }
        : i
    );
    updateLayout(newLayout);
  };

  const handleRemoveItem = (placementId) => {
    const newLayout = world.roomLayout.filter((i) => i.placementId !== placementId);
    updateLayout(newLayout);
    setSelectedItem(null);
    toast.success('Item removed from room');
  };

  // ─── Render ───
  if (pageLoading) return <Loading message="Loading your world..." />;

  const theme = roomThemeStyles[world?.roomTheme] || roomThemeStyles.cozy;

  // Get placeable inventory items (items that aren't consumable/theme)
  const placeableItems = inventory.filter(
    (inv) => inv.item && inv.item.itemType === 'placeable'
  );

  return (
    <div className="page-enter space-y-4">
      {/* ─── HUD ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            {pet?.name}'s Room
          </h1>
          <p className="text-sm text-ink-muted">{user?.displayName}'s TinyWorld</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-1.5 shadow-soft">
            <Coins className="w-4 h-4 text-peach-dark" />
            <span className="font-semibold text-sm text-ink">{user?.coins ?? 0}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-1.5 shadow-soft">
            <Star className="w-4 h-4 text-lavender-dark" />
            <span className="font-semibold text-sm text-ink">Lv. {user?.level ?? 1}</span>
          </div>
        </div>
      </div>

      {/* ─── Room Canvas ─── */}
      <div
        ref={roomRef}
        className={`room-canvas relative w-full h-[320px] sm:h-[380px] md:h-[420px] rounded-3xl overflow-hidden bg-gradient-to-b ${theme.wall} border-2 ${editMode ? 'border-lavender-dark border-dashed' : 'border-white/60 shadow-card'}`}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Room floor area */}
        <div className={`absolute bottom-0 left-0 right-0 h-[45%] ${theme.floor} rounded-b-xl`} />

        {/* Window decoration */}
        <div className="absolute top-4 right-6 w-14 h-18 md:w-16 md:h-20 bg-sky/30 rounded-lg border-2 border-white/50">
          <div className="w-full h-px bg-white/50 absolute top-1/2" />
          <div className="w-px h-full bg-white/50 absolute left-1/2" />
        </div>

        {/* Placed items */}
        {world?.roomLayout?.map((placed) => {
          const emoji = itemEmojis[inventory.find((inv) => inv.itemId === placed.itemId)?.item?.assetKey] || '📦';
          return (
            <div
              key={placed.placementId}
              className={`room-object ${dragRef.current.id === placed.placementId && dragRef.current.dragging ? 'dragging' : ''} ${selectedItem === placed.placementId ? 'selected' : ''}`}
              style={{
                left: `${placed.x * 100}%`,
                top: `${placed.y * 100}%`,
                transform: `translate(-50%, -50%) rotate(${placed.rotation || 0}deg)`,
                zIndex: placed.layer || 0,
                fontSize: '2rem',
              }}
              onPointerDown={(e) => handlePointerDown(e, placed.placementId)}
            >
              <span className="select-none pointer-events-none">{emoji}</span>
            </div>
          );
        })}

        {/* Pet */}
        {pet && (
          <div
            className={`absolute bottom-[15%] left-1/2 -translate-x-1/2 z-30 cursor-pointer select-none ${petAnimation || 'animate-float'}`}
            onClick={handlePetClick}
          >
            {/* Speech bubble */}
            {speechBubble && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-xl px-3 py-1.5 shadow-soft text-sm font-medium text-ink whitespace-nowrap animate-pop-in z-40">
                {speechBubble}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 bg-white rotate-45" />
              </div>
            )}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-lavender/60 flex items-center justify-center shadow-lg hover:shadow-glow-lavender transition-all">
              <span className="text-3xl md:text-4xl">{petEmojis[pet.species] || '🐾'}</span>
            </div>
            <p className="text-center text-xs font-semibold text-ink-muted mt-1">{pet.name}</p>
          </div>
        )}

        {/* Edit mode badge */}
        {editMode && (
          <div className="absolute top-3 left-3 bg-lavender-dark text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md animate-pop-in z-40">
            ✏️ Edit Mode
          </div>
        )}
      </div>

      {/* ─── Room Controls ─── */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={editMode ? 'accent' : 'outline'}
          size="sm"
          onClick={toggleEditMode}
          icon={editMode ? Eye : Edit3}
        >
          {editMode ? 'Done Editing' : 'Edit Room'}
        </Button>

        {editMode && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowInventory(true)}
              icon={Plus}
            >
              Add Item
            </Button>
            {selectedItem && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRotateItem(selectedItem)}
                  icon={RotateCw}
                >
                  Rotate
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveItem(selectedItem)}
                  icon={Trash2}
                >
                  Remove
                </Button>
              </>
            )}
          </>
        )}
      </div>

      {/* ─── Pet Stats & Actions ─── */}
      {pet && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pet Stats */}
          <div className="bg-white rounded-2xl shadow-soft p-5">
            <h3 className="font-display font-bold text-ink mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-peach-dark" />
              {pet.name}'s Status
            </h3>
            <div className="space-y-3">
              <ProgressBar
                value={pet.hunger}
                max={100}
                color="peach"
                label="Hunger"
                showLabel
                size="sm"
              />
              <ProgressBar
                value={pet.happiness}
                max={100}
                color="lavender"
                label="Happiness"
                showLabel
                size="sm"
              />
              <ProgressBar
                value={pet.energy}
                max={100}
                color="sage"
                label="Energy"
                showLabel
                size="sm"
              />
            </div>
          </div>

          {/* Pet Actions */}
          <div className="bg-white rounded-2xl shadow-soft p-5">
            <h3 className="font-display font-bold text-ink mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-lavender-dark" />
              Interactions
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleFeed}
                disabled={!!actionLoading}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-peach/10 hover:bg-peach/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <UtensilsCrossed className="w-5 h-5 text-peach-dark" />
                <span className="text-xs font-semibold text-ink">Feed</span>
              </button>
              <button
                onClick={handlePetPet}
                disabled={!!actionLoading}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-lavender/10 hover:bg-lavender/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Hand className="w-5 h-5 text-lavender-dark" />
                <span className="text-xs font-semibold text-ink">Pet</span>
              </button>
              <button
                onClick={handleRest}
                disabled={!!actionLoading}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-sage/10 hover:bg-sage/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Moon className="w-5 h-5 text-sage-dark" />
                <span className="text-xs font-semibold text-ink">Rest</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Inventory Modal ─── */}
      <Modal
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
        title="Your Inventory"
      >
        {placeableItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-ink-muted mb-2">No placeable items yet!</p>
            <p className="text-sm text-ink-muted">Visit the Shop to buy furniture and decorations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {placeableItems.map((inv) => {
              const emoji = itemEmojis[inv.item?.assetKey] || '📦';
              const placedCount = world?.roomLayout?.filter((l) => l.itemId === inv.itemId).length || 0;
              const canPlace = inv.item?.stackable || placedCount < inv.quantity;
              return (
                <button
                  key={inv.itemId}
                  onClick={() => {
                    if (canPlace) {
                      handlePlaceItem(inv);
                      setShowInventory(false);
                    }
                  }}
                  disabled={!canPlace}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    canPlace
                      ? 'border-cream-dark hover:border-lavender hover:bg-lavender/5'
                      : 'border-cream-dark opacity-40 cursor-not-allowed'
                  }`}
                >
                  <span className="text-2xl mb-1">{emoji}</span>
                  <span className="text-xs font-semibold text-ink">{inv.item?.name}</span>
                  {!canPlace && (
                    <span className="text-[10px] text-ink-muted">Already placed</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}
