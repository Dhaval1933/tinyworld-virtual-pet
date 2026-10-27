import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { activityService } from '../../services';
import Button from '../common/Button';
import {
  Trophy,
  Heart,
  Timer,
  Zap,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Coins,
  Star,
} from 'lucide-react';
import toast from 'react-hot-toast';

const TREAT_TYPES = [
  { emoji: '🍓', name: 'Strawberry', points: 10, speed: 2.8, isBad: false },
  { emoji: '🐟', name: 'Golden Fish', points: 20, speed: 3.2, isBad: false },
  { emoji: '🍰', name: 'Berry Cake', points: 25, speed: 3.5, isBad: false },
  { emoji: '🥞', name: 'Honey Pancakes', points: 30, speed: 3.8, isBad: false },
  { emoji: '🧀', name: 'Cheese', points: 15, speed: 3.0, isBad: false },
  { emoji: '⭐', name: 'Star Candy', points: 50, speed: 4.2, isBad: false },
  { emoji: '👟', name: 'Old Boot', points: 0, speed: 3.4, isBad: true },
  { emoji: '💣', name: 'Water Bomb', points: 0, speed: 3.6, isBad: true },
];

export default function TreatCatchGame({ onBack }) {
  const { user, refreshUser } = useAuth();
  const { pet, fetchPet } = useGame();

  const [gameState, setGameState] = useState('ready'); // 'ready' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [paddleX, setPaddleX] = useState(50); // percentage 0 - 100
  const [fallingItems, setFallingItems] = useState([]);
  const [bursts, setBursts] = useState([]);
  const [rewards, setRewards] = useState(null);
  const [savingReward, setSavingReward] = useState(false);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastSpawnRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const comboRef = useRef(0);
  const paddleXRef = useRef(50);

  // Keep refs in sync for 60fps loop
  paddleXRef.current = paddleX;
  scoreRef.current = score;
  livesRef.current = lives;
  comboRef.current = combo;

  // Start game
  const startGame = () => {
    setScore(0);
    setCombo(0);
    setLives(3);
    setTimeLeft(60);
    setFallingItems([]);
    setBursts([]);
    setRewards(null);
    setPaddleX(50);
    scoreRef.current = 0;
    livesRef.current = 3;
    comboRef.current = 0;
    setGameState('playing');
    lastSpawnRef.current = Date.now();
  };

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setPaddleX((x) => Math.max(8, x - 6));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setPaddleX((x) => Math.min(92, x + 6));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Pointer/Mouse movement
  const handlePointerMove = (e) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setPaddleX(Math.max(8, Math.min(92, x)));
  };

  // 60-second countdown timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  // End game & submit reward
  const endGame = useCallback(async () => {
    setGameState('gameover');
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const finalScore = scoreRef.current;
    const earnedCoins = Math.min(30, Math.max(10, Math.floor(finalScore / 12)));
    const earnedXP = Math.min(35, Math.max(15, Math.floor(finalScore / 10)));

    setSavingReward(true);
    try {
      const idempotencyKey = `treat-catch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const res = await activityService.complete({
        activityType: 'mini-game',
        title: `Treat Catch Frenzy: Scored ${finalScore} pts`,
        note: `Caught delicious treats in Talking Tom style mini-game!`,
        durationMinutes: 2,
        idempotencyKey,
      });

      setRewards({
        coins: res.rewards?.coins || earnedCoins,
        xp: res.rewards?.xp || earnedXP,
      });
      await Promise.all([refreshUser?.(), fetchPet?.()]);
      toast.success(`Game over! Earned +${res.rewards?.coins || earnedCoins} coins! 🎉`);
    } catch (err) {
      console.warn('Reward submission notice:', err.message);
      setRewards({ coins: earnedCoins, xp: earnedXP });
    } finally {
      setSavingReward(false);
    }
  }, [refreshUser, fetchPet]);

  // Main 60fps Game Animation Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let running = true;

    const gameLoop = () => {
      if (!running) return;
      const now = Date.now();

      // Spawn falling treats
      if (now - lastSpawnRef.current > 750) {
        const itemType = TREAT_TYPES[Math.floor(Math.random() * TREAT_TYPES.length)];
        const newItem = {
          id: `item-${now}-${Math.random()}`,
          ...itemType,
          x: 10 + Math.random() * 80, // % from left
          y: -5,                      // % from top
          vx: (Math.random() - 0.5) * 0.4,
        };
        setFallingItems((items) => [...items, newItem]);
        lastSpawnRef.current = now;
      }

      // Move falling items and check collisions
      setFallingItems((prevItems) => {
        const updated = [];
        const currentPaddleX = paddleXRef.current;

        for (const item of prevItems) {
          const nextY = item.y + item.speed * 0.45;
          const nextX = item.x + item.vx;

          // Check paddle collision zone (Y: 80% - 90%)
          if (nextY >= 80 && nextY <= 90 && Math.abs(nextX - currentPaddleX) < 9) {
            // Collision caught!
            if (item.isBad) {
              // Bad item: lose a heart
              setLives((l) => {
                const nextLives = l - 1;
                livesRef.current = nextLives;
                if (nextLives <= 0) {
                  endGame();
                }
                return Math.max(0, nextLives);
              });
              setCombo(0);
              comboRef.current = 0;
              // Red burst
              setBursts((b) => [
                ...b,
                { id: `burst-${now}`, x: nextX, y: nextY, text: '💥 Ouch!', color: '#FF5252' },
              ]);
            } else {
              // Delicious treat caught!
              const currentCombo = comboRef.current;
              const multiplier = currentCombo >= 10 ? 2.5 : currentCombo >= 5 ? 1.8 : 1.0;
              const addedPoints = Math.round(item.points * multiplier);

              setScore((s) => s + addedPoints);
              setCombo((c) => c + 1);
              comboRef.current = currentCombo + 1;

              // Golden particle burst
              setBursts((b) => [
                ...b,
                {
                  id: `burst-${now}`,
                  x: nextX,
                  y: nextY,
                  text: `+${addedPoints}`,
                  color: item.points >= 30 ? '#FFD54F' : '#69F0AE',
                },
              ]);
            }
            continue; // Remove caught item
          }

          // If dropped past bottom edge
          if (nextY > 102) {
            if (!item.isBad) {
              // Missed a delicious treat resets combo
              setCombo(0);
              comboRef.current = 0;
            }
            continue; // Dropped off screen
          }

          updated.push({ ...item, x: nextX, y: nextY });
        }
        return updated;
      });

      // Clear old bursts
      setBursts((prev) => prev.filter((b) => now - parseInt(b.id.split('-')[1]) < 600));

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, endGame]);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-soft border border-cream-dark space-y-4">
      {/* ─── HEADER / CONTROLS ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-2xl bg-cream hover:bg-cream-dark text-ink transition-all cursor-pointer"
              title="Back to Mini-Games"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink flex items-center gap-2">
              <span>🍓 Treat Catch Frenzy</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-peach/30 text-peach-dark font-bold border border-peach/50">
                Talking Tom Style
              </span>
            </h2>
            <p className="text-xs text-ink-muted">
              Catch delicious snacks for {pet?.name || 'your pet'}! Avoid boots & bombs.
            </p>
          </div>
        </div>

        {/* Live HUD Badges */}
        {gameState === 'playing' && (
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-2xl border border-rose-200 text-rose-600 font-bold text-sm shadow-2xs">
              <Heart className="w-4 h-4 fill-rose-500" />
              <span>{lives}</span>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200 text-amber-700 font-bold text-sm shadow-2xs">
              <Timer className="w-4 h-4 text-amber-600" />
              <span>{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-1 bg-lavender/30 px-3.5 py-1.5 rounded-2xl border border-lavender/50 text-ink font-bold text-sm shadow-2xs">
              <Trophy className="w-4 h-4 text-lavender-dark" />
              <span>{score}</span>
            </div>
          </div>
        )}
      </div>

      {/* ─── MAIN GAME CANVAS ─── */}
      <div
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        className="relative w-full h-[380px] sm:h-[420px] rounded-3xl overflow-hidden select-none bg-gradient-to-b from-[#FFF5EC] via-[#FFF9F2] to-[#FFE8D6] border-3 border-cream-dark shadow-inner cursor-pointer"
        style={{ touchAction: 'none' }}
      >
        {/* Background garden clouds & sun */}
        <div className="absolute top-4 left-6 text-3xl opacity-80 animate-float">☁️</div>
        <div className="absolute top-8 right-10 text-2xl opacity-75 animate-float" style={{ animationDelay: '2s' }}>☁️</div>
        <div className="absolute top-4 right-1/3 text-2xl opacity-60">☀️</div>

        {/* Floor grass line */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#81C784] to-[#A5D6A7] border-t-2 border-[#66BB6A]" />

        {/* ─── READY STATE OVERLAY ─── */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30 animate-fade-in">
            <div className="text-6xl mb-3 animate-bounce-gentle">🍓🐾🍰</div>
            <h3 className="font-display text-2xl font-bold text-ink mb-2">
              Ready to Catch Treats?
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted max-w-sm mb-6">
              Move your mouse, tap left/right, or use arrow keys to catch delicious strawberries, fish, and cakes! Don't let your 3 hearts run out!
            </p>
            <Button variant="accent" size="lg" onClick={startGame} icon={Zap}>
              Start Catching! 🎮
            </Button>
          </div>
        )}

        {/* ─── GAME OVER STATE OVERLAY ─── */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30 animate-pop-in">
            <div className="text-5xl mb-2">🏆🎉</div>
            <h3 className="font-display text-2xl font-bold text-ink mb-1">
              Treat Feast Complete!
            </h3>
            <p className="text-sm font-semibold text-ink-muted mb-4">
              Final Score: <span className="text-peach-dark font-extrabold text-xl">{score} pts</span>
            </p>

            {/* Earned Rewards Badge */}
            {rewards && (
              <div className="flex items-center gap-4 bg-cream/80 border border-cream-dark px-5 py-2.5 rounded-2xl mb-5 shadow-xs animate-pop-in">
                <div className="flex items-center gap-1.5 font-bold text-peach-dark">
                  <Coins className="w-4 h-4" />
                  <span>+{rewards.coins} Coins</span>
                </div>
                <div className="w-px h-4 bg-cream-dark" />
                <div className="flex items-center gap-1.5 font-bold text-lavender-dark">
                  <Star className="w-4 h-4" />
                  <span>+{rewards.xp} XP</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button variant="primary" size="md" onClick={startGame} icon={RotateCcw}>
                Play Again
              </Button>
              {onBack && (
                <Button variant="ghost" size="md" onClick={onBack}>
                  All Games
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ─── ACTIVE PLAYING LAYER ─── */}
        {gameState === 'playing' && (
          <>
            {/* Combo Banner */}
            {combo >= 3 && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-peach to-amber-300 text-ink text-xs font-black px-4 py-1 rounded-full shadow-card animate-pulse border border-white">
                🔥 {combo}x COMBO! {combo >= 10 ? '✨ ULTRA FEAST!' : ''}
              </div>
            )}

            {/* Falling Treats */}
            {fallingItems.map((item) => (
              <div
                key={item.id}
                className="absolute text-3xl select-none pointer-events-none transition-transform"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {item.emoji}
              </div>
            ))}

            {/* Floating Point & Damage Bursts */}
            {bursts.map((b) => (
              <div
                key={b.id}
                className="absolute text-sm font-black select-none pointer-events-none animate-float"
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  color: b.color,
                  textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {b.text}
              </div>
            ))}

            {/* The Pet Paddle / Treat Basket */}
            <div
              className="absolute bottom-2 select-none pointer-events-none transition-transform duration-75"
              style={{
                left: `${paddleX}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {/* Pet Companion Head / Bowl */}
              <div className="flex flex-col items-center">
                <div className="text-4xl animate-bounce-gentle">
                  {pet?.species === 'mochi' ? '🐱' : pet?.species === 'pebble' ? '🐰' : '🌱'}
                </div>
                {/* Woven treat basket */}
                <div className="w-16 h-6 bg-[#C49363] rounded-b-xl border-2 border-[#8D5B28] shadow-md flex items-center justify-center text-[10px] text-white font-bold">
                  🧺 Catch!
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── MOBILE ON-SCREEN ARROW CONTROLS ─── */}
      {gameState === 'playing' && (
        <div className="flex sm:hidden items-center justify-between gap-4 pt-1">
          <button
            onPointerDown={() => setPaddleX((x) => Math.max(8, x - 12))}
            className="flex-1 py-3 bg-cream hover:bg-cream-dark active:scale-95 rounded-2xl font-bold text-ink flex items-center justify-center gap-2 border border-cream-dark"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Move Left</span>
          </button>
          <button
            onPointerDown={() => setPaddleX((x) => Math.min(92, x + 12))}
            className="flex-1 py-3 bg-cream hover:bg-cream-dark active:scale-95 rounded-2xl font-bold text-ink flex items-center justify-center gap-2 border border-cream-dark"
          >
            <span>Move Right</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
