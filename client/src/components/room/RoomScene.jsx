import React, { useRef, useState, useEffect } from 'react';
import { FurnitureIllustration, CurtainsIllustration } from './RoomIllustrations';
import PetAvatar from './PetAvatar';
import {
  RotateCw,
  ArrowUp,
  ArrowDown,
  Trash2,
  Sparkles,
  Sun,
  Eye,
  LogOut,
  Sliders,
  Lock,
  Unlock,
  Coins,
  Star,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../common/Button';

const roomThemeStyles = {
  cozy: {
    wall: 'from-peach/30 via-cream to-peach/15',
    wallBorder: 'border-peach/30',
    floor: 'bg-[#F2DEC9]',
    floorLines: 'rgba(180, 140, 100, 0.25)',
    windowSky: 'from-sky/50 via-sky/20 to-peach/30',
    sunbeam: 'rgba(255, 240, 200, 0.18)',
  },
  forest: {
    wall: 'from-sage/35 via-cream to-sage/20',
    wallBorder: 'border-sage/40',
    floor: 'bg-[#D7E3CE]',
    floorLines: 'rgba(120, 160, 110, 0.25)',
    windowSky: 'from-sage/40 via-sky/20 to-sage/20',
    sunbeam: 'rgba(220, 245, 210, 0.18)',
  },
  cloud: {
    wall: 'from-sky/35 via-lavender/20 to-cream',
    wallBorder: 'border-sky/40',
    floor: 'bg-[#E5EEF9]',
    floorLines: 'rgba(160, 180, 220, 0.25)',
    windowSky: 'from-sky/60 via-lavender/30 to-cream',
    sunbeam: 'rgba(235, 240, 255, 0.22)',
  },
  ocean: {
    wall: 'from-sky/45 via-sky/20 to-cream',
    wallBorder: 'border-sky/50',
    floor: 'bg-[#DCEBF4]',
    floorLines: 'rgba(120, 180, 210, 0.25)',
    windowSky: 'from-sky/70 via-sky/30 to-sky/10',
    sunbeam: 'rgba(210, 245, 255, 0.2)',
  },
};

export const BALCONY_VIEWS = {
  sunset: {
    id: 'sunset',
    name: 'Sunset Horizon',
    emoji: '🌅',
    skyGradient: 'from-[#FF6B6B] via-[#FFA07A] to-[#FFE4C4]',
    mountains: true,
    cost: 0,
    levelReq: 1,
    free: true,
    desc: 'Golden amber sky over distant silhouette mountains. Default free view!',
  },
  'cherry-blossom': {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    emoji: '🌸',
    skyGradient: 'from-[#FBC2EB] via-[#FCE4EC] to-[#E8F5E9]',
    petals: true,
    cost: 100,
    levelReq: 2,
    desc: 'Soft pastel spring breeze with drifting sakura flower petals.',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Breeze',
    emoji: '🌊',
    skyGradient: 'from-[#4facfe] via-[#00f2fe] to-[#a8edea]',
    ocean: true,
    cost: 150,
    levelReq: 2,
    desc: 'Crystal coastal waves, drifting clouds, and gentle sailboats.',
  },
  'rainy-garden': {
    id: 'rainy-garden',
    name: 'Rainy Garden',
    emoji: '🌧️',
    skyGradient: 'from-[#37474F] via-[#546E7A] to-[#37474F]',
    rain: true,
    cost: 200,
    levelReq: 3,
    desc: 'Calming rain streaks, mist, and lush weeping greenery.',
  },
  city: {
    id: 'city',
    name: 'City Lights',
    emoji: '🏙️',
    skyGradient: 'from-[#19182C] via-[#352D54] to-[#6C5B7B]',
    cityline: true,
    cost: 250,
    levelReq: 3,
    desc: 'Glowing skyscrapers under a vibrant twilight metropolis sky.',
  },
  galaxy: {
    id: 'galaxy',
    name: 'Cosmic Galaxy',
    emoji: '🌌',
    skyGradient: 'from-[#0B0C1E] via-[#1A1838] to-[#2E2856]',
    stars: true,
    cost: 350,
    levelReq: 4,
    desc: 'Deep cosmic nebula with twinkling stars and an ethereal aurora.',
  },
};

export default function RoomScene({
  world,
  pet,
  user,
  inventory = [],
  editMode = false,
  selectedItem,
  onSelectItem,
  onUpdateLayout,
  onRotateItem,
  onChangeLayer,
  onRemoveItem,
  petState = 'idle',
  speechBubble = '',
  onPetClick,
  onSceneChange,
  onViewChange,
  onUnlockBalconyView,
}) {
  const roomRef = useRef(null);
  const dragRef = useRef({
    dragging: false,
    id: null,
    pointerId: null,
    offsetX: 0,
    offsetY: 0,
    initialX: 0,
    initialY: 0,
  });

  const [activeDragId, setActiveDragId] = useState(null);
  const [activeScene, setActiveScene] = useState(world?.activeScene || 'room');
  const [balconyView, setBalconyView] = useState(world?.balconyView || 'sunset');
  const [unlockModalView, setUnlockModalView] = useState(null);
  const [unlocking, setUnlocking] = useState(false);

  // Keep local states in sync with world prop
  useEffect(() => {
    if (world?.activeScene) setActiveScene(world.activeScene);
    if (world?.balconyView) setBalconyView(world.balconyView);
  }, [world?.activeScene, world?.balconyView]);

  const handleSceneSwitch = (newScene) => {
    setActiveScene(newScene);
    onSelectItem(null);
    if (onSceneChange) onSceneChange(newScene);
  };

  const handleViewSwitch = (newView) => {
    setBalconyView(newView);
    if (onViewChange) onViewChange(newView);
  };

  const handleUnlockConfirm = async (viewToUnlock) => {
    if (!viewToUnlock) return;
    setUnlocking(true);
    try {
      if (onUnlockBalconyView) {
        await onUnlockBalconyView(viewToUnlock.id);
      }
      setBalconyView(viewToUnlock.id);
      if (onViewChange) onViewChange(viewToUnlock.id);
      setUnlockModalView(null);
      toast.success(`Unlocked and set view to ${viewToUnlock.name}! 🌅✨`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to unlock view');
    } finally {
      setUnlocking(false);
    }
  };

  const theme = roomThemeStyles[world?.roomTheme] || roomThemeStyles.cozy;
  const currentView = BALCONY_VIEWS[balconyView] || BALCONY_VIEWS.sunset;

  // ─── Window & Curtains Constraint Check ───
  // Curtains are only mounted directly on the window slot, never loose on the floor!
  const curtainItem = world?.roomLayout?.find(
    (i) => i.itemId === 'window-curtains' || i.itemId === 'curtains'
  );
  const hasCurtains = Boolean(curtainItem);

  const handleWindowClick = () => {
    if (activeScene !== 'room') return;
    if (!editMode) {
      toast('A cozy window looking out into the gentle world 🪟', { icon: '🌤️' });
      return;
    }

    if (hasCurtains) {
      // Allow removing curtains back to inventory
      onRemoveItem(curtainItem.placementId);
      toast.success('Removed Curtains from the window! Put back in inventory.');
    } else {
      // Check if user owns curtains in inventory
      const ownedCurtain = inventory.find(
        (inv) => inv.itemId === 'window-curtains' || inv.itemId === 'curtains'
      );
      if (ownedCurtain) {
        // Mount onto window
        const newPlacementId = `curtains-${Date.now()}`;
        const newLayout = [
          ...(world?.roomLayout || []),
          {
            placementId: newPlacementId,
            itemId: ownedCurtain.itemId,
            x: 0.88,
            y: 0.18,
            rotation: 0,
            layer: 5,
          },
        ];
        onUpdateLayout(newLayout, true, 'room');
        toast.success('Window Curtains installed onto the window! 🪟✨');
      } else {
        toast('You don’t own Window Curtains yet. Visit the Shop to get them! 🛍️', {
          icon: '🪟',
        });
      }
    }
  };

  // ─── Pointer Event Handlers (Mouse & Touch Drag-and-Drop) ───
  const handlePointerDown = (e, placementId) => {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();

    const room = roomRef.current;
    if (!room) return;
    const rect = room.getBoundingClientRect();
    const currentList = activeScene === 'balcony' ? (world?.balconyLayout || []) : (world?.roomLayout || []);
    const item = currentList.find((i) => i.placementId === placementId);
    if (!item) return;

    const pixelX = item.x * rect.width;
    const pixelY = item.y * rect.height;

    dragRef.current = {
      dragging: true,
      id: placementId,
      pointerId: e.pointerId,
      offsetX: e.clientX - (rect.left + pixelX),
      offsetY: e.clientY - (rect.top + pixelY),
      initialX: item.x,
      initialY: item.y,
    };

    setActiveDragId(placementId);
    onSelectItem(placementId);

    try {
      room.setPointerCapture(e.pointerId);
    } catch {
      // fallback
    }
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.dragging) return;
    e.preventDefault();

    const room = roomRef.current;
    if (!room) return;
    const rect = room.getBoundingClientRect();

    const rawX = (e.clientX - rect.left - dragRef.current.offsetX) / rect.width;
    const rawY = (e.clientY - rect.top - dragRef.current.offsetY) / rect.height;

    // Bounds checking
    const clampedX = Math.max(0.08, Math.min(0.92, Number(rawX.toFixed(3))));
    const clampedY = Math.max(
      activeScene === 'balcony' ? 0.40 : 0.18,
      Math.min(0.86, Number(rawY.toFixed(3)))
    );

    const currentList = activeScene === 'balcony' ? (world?.balconyLayout || []) : (world?.roomLayout || []);
    const newLayout = currentList.map((item) =>
      item.placementId === dragRef.current.id
        ? { ...item, x: clampedX, y: clampedY }
        : item
    );

    onUpdateLayout(newLayout, false, activeScene);
  };

  const handlePointerUp = (_e) => {
    if (dragRef.current.dragging) {
      const room = roomRef.current;
      if (room && dragRef.current.pointerId !== null) {
        try {
          room.releasePointerCapture(dragRef.current.pointerId);
        } catch {}
      }

      const currentList = activeScene === 'balcony' ? (world?.balconyLayout || []) : (world?.roomLayout || []);
      onUpdateLayout(currentList, true, activeScene);

      dragRef.current = {
        dragging: false,
        id: null,
        pointerId: null,
        offsetX: 0,
        offsetY: 0,
        initialX: 0,
        initialY: 0,
      };
      setActiveDragId(null);
    }
  };

  const handleCanvasClick = (e) => {
    if (
      e.target === roomRef.current ||
      e.target.classList.contains('room-floor-layer') ||
      e.target.classList.contains('balcony-deck-layer')
    ) {
      if (editMode) {
        onSelectItem(null);
      }
    }
  };

  const getItemDetails = (itemId) => {
    return inventory.find((inv) => inv.itemId === itemId)?.item || { assetKey: itemId };
  };

  // ─── SCENE LAYOUT ISOLATION ───
  // When in Balcony mode, placeableItems is strictly world.balconyLayout!
  // When in Room mode, placeableItems is strictly world.roomLayout (curtains filtered to window)!
  // Room furniture NEVER appears on the balcony, and Balcony furniture NEVER appears in the room!
  const placeableItems =
    activeScene === 'balcony'
      ? world?.balconyLayout || []
      : (world?.roomLayout || []).filter(
          (i) => i.itemId !== 'window-curtains' && i.itemId !== 'curtains'
        );

  const unlockedViews = world?.unlockedBalconyViews || ['sunset'];

  return (
    <div className="space-y-2">
      {/* ─── SCENE NAVIGATION TABS (Cozy Room vs Scenic Balcony) ─── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs p-1 rounded-2xl border border-cream-dark shadow-xs">
          <button
            type="button"
            onClick={() => handleSceneSwitch('room')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeScene === 'room'
                ? 'bg-lavender text-ink shadow-xs'
                : 'text-ink-muted hover:text-ink hover:bg-cream'
            }`}
          >
            <span>🛋️</span>
            <span>Cozy Room</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-white/60 rounded-full font-semibold">
              {(world?.roomLayout || []).filter(i => i.itemId !== 'window-curtains').length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleSceneSwitch('balcony')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeScene === 'balcony'
                ? 'bg-sage text-ink shadow-xs'
                : 'text-ink-muted hover:text-ink hover:bg-cream'
            }`}
          >
            <span>🌿</span>
            <span>Scenic Balcony</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-white/60 rounded-full font-semibold">
              {(world?.balconyLayout || []).length}
            </span>
          </button>
        </div>

        {/* Balcony View Switcher Pills (Visible when in Balcony mode) */}
        {activeScene === 'balcony' && (
          <div className="flex flex-wrap items-center gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-2xl border border-cream-dark shadow-xs animate-fade-in">
            <span className="text-[11px] font-bold text-ink-muted px-2 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-sage-dark" /> View:
            </span>
            {Object.values(BALCONY_VIEWS).map((v) => {
              const isUnlocked = unlockedViews.includes(v.id) || v.free;
              const isSelected = balconyView === v.id;

              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    if (isUnlocked) {
                      handleViewSwitch(v.id);
                    } else {
                      setUnlockModalView(v);
                    }
                  }}
                  className={`px-2 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-sage-dark text-white shadow-2xs font-bold'
                      : isUnlocked
                      ? 'text-ink-muted hover:text-ink hover:bg-cream'
                      : 'text-ink-muted/70 bg-cream/50 hover:bg-cream hover:text-ink border border-cream-dark/60'
                  }`}
                  title={isUnlocked ? v.name : `Locked • Click to unlock ${v.name}`}
                >
                  <span>{v.emoji}</span>
                  <span className="hidden sm:inline">{v.name}</span>
                  {!isUnlocked && (
                    <span className="flex items-center text-[10px] text-peach-dark ml-0.5">
                      <Lock className="w-2.5 h-2.5 mr-0.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── 2D GAME CANVAS CONTAINER ─── */}
      <div
        ref={roomRef}
        onClick={handleCanvasClick}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`room-canvas relative w-full h-[360px] sm:h-[420px] md:h-[460px] rounded-3xl overflow-hidden border-3 select-none transition-all ${
          activeScene === 'balcony'
            ? `bg-gradient-to-b ${currentView.skyGradient}`
            : `bg-gradient-to-b ${theme.wall}`
        } ${
          editMode
            ? 'border-lavender-dark shadow-glow-lavender cursor-crosshair'
            : 'border-white/80 shadow-float cursor-default'
        }`}
        style={{ touchAction: 'none' }}
      >
        {/* ========================================================= */}
        {/* SCENE 1: INDOOR COZY ROOM                                */}
        {/* ========================================================= */}
        {activeScene === 'room' && (
          <>
            {/* ─── WALL AREA (Top 52%) ─── */}
            <div className="absolute top-0 left-0 right-0 h-[52%] overflow-hidden pointer-events-none">
              {/* Wallpaper stripes */}
              <div
                className="w-full h-full opacity-15"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(0,0,0,0.06) 38px, rgba(0,0,0,0.06) 40px)',
                }}
              />

              {/* Sunbeam Light */}
              <div
                className="absolute -top-10 left-10 w-[70%] h-[180%] transform -rotate-25 pointer-events-none"
                style={{
                  background: `linear-gradient(to right, transparent, ${theme.sunbeam}, transparent)`,
                }}
              />

              {/* Left French Balcony Door leading out to Balcony */}
              <div
                onClick={() => handleSceneSwitch('balcony')}
                className="absolute top-5 left-5 w-22 h-36 rounded-t-2xl border-4 border-white/95 bg-gradient-to-b from-sky/40 via-emerald-100/40 to-sage/30 shadow-md flex flex-col justify-between overflow-hidden cursor-pointer hover:border-lavender hover:scale-102 transition-all pointer-events-auto group"
                title="Step out to Scenic Balcony 🌿"
              >
                {/* Glass Door Grids */}
                <div className="p-2 grid grid-cols-2 gap-1.5 flex-1">
                  <div className="bg-white/40 rounded-sm border border-white/60" />
                  <div className="bg-white/40 rounded-sm border border-white/60" />
                  <div className="bg-white/40 rounded-sm border border-white/60" />
                  <div className="bg-white/40 rounded-sm border border-white/60" />
                </div>
                {/* Brass Door Handle */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-amber-400 rounded-full shadow-xs" />
                <div className="bg-white/95 text-[9px] font-bold text-center text-ink-muted py-1 border-t border-white/80 group-hover:text-lavender-dark">
                  Balcony 🌿
                </div>
              </div>

              {/* Cozy Scenic Window with strictly fitted Curtains */}
              <div
                onClick={handleWindowClick}
                className={`absolute top-6 right-8 sm:right-14 w-20 h-28 sm:w-24 sm:h-32 rounded-t-full rounded-b-xl border-4 border-white/90 bg-gradient-to-b shadow-md flex flex-col pointer-events-auto transition-transform ${
                  editMode ? 'cursor-pointer hover:scale-103 hover:ring-2 hover:ring-lavender-dark' : ''
                }`}
                title={editMode ? (hasCurtains ? 'Click to remove curtains' : 'Click to install curtains') : 'Window'}
              >
                {/* Outdoor Sky Gradient */}
                <div className={`w-full h-full bg-gradient-to-b ${theme.windowSky} relative overflow-hidden rounded-t-full rounded-b-lg`}>
                  <div className="absolute top-3 left-2 w-6 h-3 bg-white/70 rounded-full animate-float" />
                  <div
                    className="absolute top-8 right-2 w-7 h-3.5 bg-white/60 rounded-full animate-float"
                    style={{ animationDelay: '1.5s' }}
                  />
                  <div className="absolute top-4 right-3 w-4 h-4 rounded-full bg-warning/80 shadow-glow-peach" />
                </div>
                {/* Window Panes Grid */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
                  <div className="border-r-2 border-b-2 border-white/80" />
                  <div className="border-b-2 border-white/80" />
                  <div className="border-r-2 border-white/80" />
                  <div />
                </div>
                {/* Window Sill */}
                <div className="w-[110%] -ml-[5%] h-2.5 bg-white rounded-full shadow-sm" />

                {/* ─── FITTED CURTAINS (Framer that perfectly matches arched window) ─── */}
                {hasCurtains && (
                  <div className="absolute -inset-x-2 -top-2.5 -bottom-1 pointer-events-none z-20">
                    <CurtainsIllustration className="w-full h-full drop-shadow-md" />
                  </div>
                )}

                {/* Edit Mode Slot Hint */}
                {editMode && (
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-white/95 text-[10px] font-bold text-ink px-2 py-0.5 rounded-full shadow-xs border border-lavender/50 whitespace-nowrap z-30 pointer-events-none">
                    {hasCurtains ? '🪟 Curtains On (Tap to Remove)' : '🪟 Window Slot (Tap to Add)'}
                  </div>
                )}
              </div>
            </div>

            {/* Baseboard divider */}
            <div className="absolute top-[52%] left-0 right-0 h-4 bg-[#B38052] shadow-sm z-10 flex flex-col justify-between border-t border-[#D7A97B] pointer-events-none">
              <div className="w-full h-0.5 bg-[#E8C59F] opacity-70" />
              <div className="w-full h-1 bg-[#8D5B28] opacity-50" />
            </div>

            {/* Floor Area */}
            <div
              className={`room-floor-layer absolute bottom-0 left-0 right-0 h-[48%] ${theme.floor} shadow-inner overflow-hidden`}
              style={{ boxShadow: 'inset 0 12px 18px -6px rgba(0,0,0,0.1)' }}
            >
              <div
                className="w-full h-full opacity-35"
                style={{
                  backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 55px, ${theme.floorLines} 55px, ${theme.floorLines} 57px)`,
                }}
              />
              <div
                className="w-full h-full absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 35px, ${theme.floorLines} 35px, ${theme.floorLines} 36px)`,
                }}
              />
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* SCENE 2: SCENIC OPEN BALCONY                             */}
        {/* ========================================================= */}
        {activeScene === 'balcony' && (
          <>
            {/* ─── PANORAMIC OUTDOOR HORIZON (Top 62%) ─── */}
            <div className="absolute top-0 left-0 right-0 h-[62%] overflow-hidden pointer-events-none">
              {/* Sunset View Details */}
              {balconyView === 'sunset' && (
                <>
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-gradient-to-t from-amber-300 via-rose-300 to-amber-100 opacity-90 shadow-glow-peach animate-pulse-soft" />
                  {/* Mountain silhouettes */}
                  <svg viewBox="0 0 500 150" className="absolute bottom-0 w-full h-28 opacity-80" preserveAspectRatio="none">
                    <path d="M 0 150 L 0 80 Q 80 20 160 85 Q 240 10 320 70 Q 400 30 500 80 L 500 150 Z" fill="#6A3A5E" />
                    <path d="M 0 150 L 0 100 Q 120 45 220 105 Q 350 50 500 110 L 500 150 Z" fill="#4A2346" opacity="0.9" />
                  </svg>
                </>
              )}

              {/* Cherry Blossom View Details */}
              {balconyView === 'cherry-blossom' && (
                <>
                  <svg viewBox="0 0 500 150" className="absolute bottom-0 w-full h-24 opacity-85" preserveAspectRatio="none">
                    <path d="M 0 150 L 0 90 Q 140 40 280 95 Q 400 60 500 90 L 500 150 Z" fill="#81C784" />
                    <path d="M 0 150 L 0 110 Q 180 70 340 115 Q 430 85 500 110 L 500 150 Z" fill="#4CAF50" opacity="0.8" />
                  </svg>
                  {/* Floating Sakura Petals */}
                  <div className="absolute top-8 left-1/4 text-sm animate-float">🌸</div>
                  <div className="absolute top-16 right-1/3 text-xs animate-float" style={{ animationDelay: '1.2s' }}>🌸</div>
                  <div className="absolute top-6 right-16 text-base animate-float" style={{ animationDelay: '2.5s' }}>🌸</div>
                </>
              )}

              {/* Galaxy Night View Details */}
              {balconyView === 'galaxy' && (
                <>
                  {/* Aurora Ribbon */}
                  <div className="absolute top-4 left-0 right-0 h-24 bg-gradient-to-r from-emerald-400/20 via-purple-400/30 to-teal-300/20 blur-xl animate-float" />
                  {/* Glowing Crescent Moon */}
                  <div className="absolute top-6 right-16 w-12 h-12 rounded-full border-r-4 border-b-4 border-amber-100 shadow-glow-lavender transform rotate-12" />
                  {/* Twinkling Stars */}
                  <div className="absolute top-8 left-12 text-white text-xs animate-pulse">✨</div>
                  <div className="absolute top-16 left-1/3 text-white text-sm animate-pulse" style={{ animationDelay: '0.8s' }}>⭐</div>
                  <div className="absolute top-10 right-1/3 text-white text-xs animate-pulse" style={{ animationDelay: '1.5s' }}>✨</div>
                  <div className="absolute top-22 right-1/4 text-white text-sm animate-pulse" style={{ animationDelay: '2.1s' }}>🌟</div>
                </>
              )}

              {/* City Lights View Details */}
              {balconyView === 'city' && (
                <>
                  <svg viewBox="0 0 500 180" className="absolute bottom-0 w-full h-32" preserveAspectRatio="none">
                    {/* Skyscraper Silhouettes */}
                    <rect x="20" y="50" width="35" height="130" fill="#24213D" />
                    <rect x="70" y="30" width="45" height="150" fill="#1C1933" />
                    <rect x="135" y="70" width="40" height="110" fill="#2E284D" />
                    <rect x="195" y="20" width="50" height="160" fill="#19162E" />
                    <rect x="265" y="60" width="42" height="120" fill="#24213D" />
                    <rect x="325" y="40" width="48" height="140" fill="#1C1933" />
                    <rect x="390" y="65" width="38" height="115" fill="#2E284D" />
                    <rect x="445" y="35" width="45" height="145" fill="#19162E" />
                    {/* Glowing Windows */}
                    <circle cx="85" cy="55" r="2" fill="#FFE082" />
                    <circle cx="100" cy="55" r="2" fill="#FFE082" />
                    <circle cx="85" cy="80" r="2" fill="#80DEEA" />
                    <circle cx="210" cy="45" r="2" fill="#FFE082" />
                    <circle cx="225" cy="45" r="2" fill="#FFE082" />
                    <circle cx="210" cy="70" r="2" fill="#FFE082" />
                    <circle cx="340" cy="60" r="2" fill="#FFE082" />
                    <circle cx="355" cy="85" r="2" fill="#80DEEA" />
                  </svg>
                </>
              )}

              {/* Ocean Breeze View Details */}
              {balconyView === 'ocean' && (
                <>
                  {/* Fluffy clouds */}
                  <div className="absolute top-5 left-10 w-24 h-8 bg-white/75 rounded-full animate-float" />
                  <div className="absolute top-10 right-16 w-32 h-9 bg-white/65 rounded-full animate-float" style={{ animationDelay: '1.8s' }} />
                  {/* Ocean Waters */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0288D1] via-[#03A9F4] to-[#29B6F6]">
                    <div className="w-full h-1 bg-white/40 mt-3 animate-pulse" />
                    <div className="w-full h-1 bg-white/30 mt-4 animate-pulse" style={{ animationDelay: '1s' }} />
                  </div>
                  {/* Distant Sailboat */}
                  <div className="absolute bottom-12 right-28 text-sm animate-float">⛵</div>
                </>
              )}

              {/* Rainy Garden View Details */}
              {balconyView === 'rainy-garden' && (
                <>
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#90A4AE_1px,transparent_1px)] [background-size:12px_12px] animate-pulse" />
                  <div className="absolute top-6 left-12 text-sm text-sky-200 animate-bounce">💧</div>
                  <div className="absolute top-14 right-20 text-sm text-sky-200 animate-bounce" style={{ animationDelay: '0.6s' }}>💧</div>
                  <div className="absolute top-10 left-1/2 text-sm text-sky-200 animate-bounce" style={{ animationDelay: '1.2s' }}>💧</div>
                  {/* Distant Misty Trees */}
                  <svg viewBox="0 0 500 120" className="absolute bottom-0 w-full h-20 opacity-70" preserveAspectRatio="none">
                    <path d="M 0 120 Q 80 40 180 120 Q 280 30 380 120 Q 450 50 500 120 Z" fill="#2E4A3B" />
                  </svg>
                </>
              )}
            </div>

            {/* ─── BALCONY RAILING & WOODEN DECK (Bottom 38%) ─── */}
            <div className="balcony-deck-layer absolute bottom-0 left-0 right-0 h-[38%] bg-[#C99C6B] shadow-inner overflow-hidden border-t-4 border-[#8D5B28]">
              {/* Wood Plank Perspective Lines */}
              <div
                className="w-full h-full opacity-30"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, transparent, transparent 48px, #5D3B17 48px, #5D3B17 50px)',
                }}
              />
              <div
                className="w-full h-full absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 28px, #5D3B17 28px, #5D3B17 29px)',
                }}
              />

              {/* Decorative Outdoor Railing along the Balcony edge */}
              <div className="absolute top-0 left-0 right-0 h-8 flex items-center justify-between px-4 pointer-events-none z-10 border-b-2 border-[#5D3B17]/40">
                <div className="w-full h-1.5 bg-[#FFF8EE] shadow-sm flex items-center justify-around">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-6 bg-white/90 border-r border-[#B38052]/40 rounded-xs shadow-2xs" />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* COMMON: PLACED FURNITURE & DECOR ITEMS                    */}
        {/* ========================================================= */}
        {placeableItems.map((item) => {
          const details = getItemDetails(item.itemId);
          const isSelected = selectedItem === item.placementId;
          const isDraggingThis = activeDragId === item.placementId;

          const isRug =
            details.assetKey === 'rug' ||
            details.assetKey?.includes('rug') ||
            details.assetKey === 'boho-runner' ||
            item.itemId.includes('rug') ||
            item.itemId.includes('runner');

          const depthZ = isRug
            ? Math.max(1, 2 + (item.layer || 0))
            : 10 + (item.layer || 0) * 10 + Math.round(item.y * 100);

          return (
            <div
              key={item.placementId}
              onPointerDown={(e) => handlePointerDown(e, item.placementId)}
              className={`room-object absolute transition-all duration-75 ${
                isDraggingThis ? 'dragging scale-105 opacity-90' : ''
              } ${isSelected ? 'selected' : ''}`}
              style={{
                left: `${item.x * 100}%`,
                top: `${item.y * 100}%`,
                transform: `translate(-50%, -50%) rotate(${item.rotation || 0}deg)`,
                zIndex: isDraggingThis ? 100 : depthZ,
                cursor: editMode ? (isDraggingThis ? 'grabbing' : 'grab') : 'default',
              }}
            >
              {/* Item SVG illustration */}
              <div className="relative group p-1">
                <FurnitureIllustration
                  assetKey={details.assetKey}
                  itemId={item.itemId}
                  className={`${
                    isRug
                      ? 'w-36 h-22 sm:w-44 sm:h-26 md:w-52 md:h-30'
                      : 'w-16 h-16 sm:w-20 sm:h-20'
                  } drop-shadow-sm select-none pointer-events-none`}
                />

                {/* Selection Halo in Edit Mode */}
                {editMode && isSelected && (
                  <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-lavender-dark shadow-glow-lavender pointer-events-none animate-pulse-soft" />
                )}
              </div>

              {/* Floating Action Controls for Selected Item */}
              {editMode && isSelected && !isDraggingThis && (
                <div
                  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs rounded-2xl px-2 py-1 shadow-card border border-cream-dark flex items-center gap-1 z-50 animate-pop-in pointer-events-auto"
                  style={{ transform: `translate(-50%, 0) rotate(-${item.rotation || 0}deg)` }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onRotateItem(item.placementId)}
                    className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-lavender/30 transition-colors cursor-pointer"
                    title="Rotate 45°"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onChangeLayer(item.placementId, 'up')}
                    className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-lavender/30 transition-colors cursor-pointer"
                    title="Bring Forward"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onChangeLayer(item.placementId, 'down')}
                    className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-lavender/30 transition-colors cursor-pointer"
                    title="Send Backward"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.placementId)}
                    className="p-1.5 rounded-lg text-danger hover:text-danger-dark hover:bg-danger/10 transition-colors cursor-pointer"
                    title="Put back in inventory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* ========================================================= */}
        {/* COMMON: COZY PET COMPANION WITH TICKLE & REACTION ZONES   */}
        {/* ========================================================= */}
        {pet && (
          <div
            className="absolute transition-all duration-300"
            style={{
              left: activeScene === 'balcony' ? '50%' : '50%',
              top: activeScene === 'balcony' ? '74%' : '72%',
              transform: 'translate(-50%, -50%)',
              zIndex: 82, // Depth at floor/deck, always sits cleanly on top of rugs
            }}
          >
            <PetAvatar
              species={pet.species}
              state={petState}
              speech={speechBubble}
              onClick={onPetClick}
            />
          </div>
        )}

        {/* ─── EDIT MODE OVERLAY HINT ─── */}
        {editMode && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs border border-lavender-dark text-ink rounded-2xl px-3.5 py-1.5 shadow-md flex items-center gap-2 text-xs font-semibold animate-pop-in z-50 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-lavender-dark animate-ping" />
            <span>
              {activeScene === 'balcony'
                ? 'Balcony Mode: Decorate your open-air terrace!'
                : 'Edit Mode: Drag items, tap to rotate or layer'}
            </span>
          </div>
        )}
      </div>

      {/* ─── UNLOCK SCENIC BALCONY VIEW MODAL ─── */}
      {unlockModalView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs animate-pop-in">
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-cream-dark overflow-hidden flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scenic Sky Gradient Banner */}
            <div className={`relative h-28 w-full bg-gradient-to-b ${unlockModalView.skyGradient} flex items-end justify-between p-4`}>
              <div className="flex items-center gap-2.5">
                <span className="text-4xl drop-shadow-md">{unlockModalView.emoji}</span>
                <div>
                  <h3 className="text-white font-display text-xl font-bold drop-shadow-md">
                    {unlockModalView.name}
                  </h3>
                  <p className="text-white/90 text-xs font-medium drop-shadow-sm">
                    Outdoor Scenic Balcony View
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUnlockModalView(null)}
                className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <p className="text-sm text-ink-muted">
                {unlockModalView.desc}
              </p>

              {/* Requirements & Balances */}
              <div className="bg-cream/50 rounded-2xl p-3 border border-cream-dark space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-muted flex items-center gap-1.5 font-semibold">
                    <Star className="w-4 h-4 text-lavender-dark" /> Required Level:
                  </span>
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      (user?.level || 1) >= unlockModalView.levelReq
                        ? 'text-sage-dark'
                        : 'text-peach-dark'
                    }`}
                  >
                    Level {unlockModalView.levelReq}
                    {(user?.level || 1) >= unlockModalView.levelReq ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-[11px] font-normal text-ink-muted">
                        (You are Lv. {user?.level || 1})
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-muted flex items-center gap-1.5 font-semibold">
                    <Coins className="w-4 h-4 text-peach-dark" /> Unlock Cost:
                  </span>
                  <span className="font-bold text-ink">
                    {unlockModalView.cost} Coins
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-cream-dark">
                  <span className="text-ink-muted font-medium">Your Coins:</span>
                  <span className="font-bold text-ink flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-peach-dark" /> {user?.coins ?? 0}
                  </span>
                </div>
              </div>

              {/* Requirement Warnings */}
              {(user?.level || 1) < unlockModalView.levelReq && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-peach/15 text-peach-dark text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Level {unlockModalView.levelReq} required. Complete activities or play mini-games to level up!
                  </span>
                </div>
              )}

              {(user?.coins ?? 0) < unlockModalView.cost && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-peach/15 text-peach-dark text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Need {unlockModalView.cost - (user?.coins ?? 0)} more coins to unlock this view.
                  </span>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUnlockModalView(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Unlock}
                  loading={unlocking}
                  disabled={
                    unlocking ||
                    (user?.level || 1) < unlockModalView.levelReq ||
                    (user?.coins ?? 0) < unlockModalView.cost
                  }
                  onClick={() => handleUnlockConfirm(unlockModalView)}
                >
                  Unlock & Set View ({unlockModalView.cost} 🪙)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
