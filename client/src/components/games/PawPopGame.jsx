import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { activityService } from '../../services';
import Button from '../common/Button';
import {
  Trophy,
  Timer,
  Zap,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Coins,
  Star,
} from 'lucide-react';
import toast from 'react-hot-toast';

const HOLE_TARGETS = [
  { emoji: '🐭', name: 'Mouse', points: 15, isBad: false },
  { emoji: '🐟', name: 'Golden Fish', points: 25, isBad: false },
  { emoji: '🍓', name: 'Berry', points: 10, isBad: false },
  { emoji: '🧀', name: 'Cheese', points: 20, isBad: false },
  { emoji: '⏰', name: 'Alarm Clock', points: -15, isBad: true },
];

export default function PawPopGame({ onBack }) {
  const { user, refreshUser } = useAuth();
  const { pet, fetchPet } = useGame();

  const [gameState, setGameState] = useState('ready'); // 'ready' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [activeHoles, setActiveHoles] = useState(Array(9).fill(null));
  const [pops, setPops] = useState([]);
  const [rewards, setRewards] = useState(null);

  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  scoreRef.current = score;
  comboRef.current = combo;

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setTimeLeft(45);
    setActiveHoles(Array(9).fill(null));
    setPops([]);
    setRewards(null);
    scoreRef.current = 0;
    comboRef.current = 0;
    setGameState('playing');
  };

  // Timer countdown
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
    setActiveHoles(Array(9).fill(null));

    const finalScore = scoreRef.current;
    const earnedCoins = Math.min(30, Math.max(10, Math.floor(finalScore / 10)));
    const earnedXP = Math.min(35, Math.max(15, Math.floor(finalScore / 8)));

    try {
      const idempotencyKey = `paw-pop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const res = await activityService.complete({
        activityType: 'mini-game',
        title: `Paw Pop Frenzy: Scored ${finalScore} pts`,
        note: `Fast-reaction pop mini-game!`,
        durationMinutes: 2,
        idempotencyKey,
      });

      setRewards({
        coins: res.rewards?.coins || earnedCoins,
        xp: res.rewards?.xp || earnedXP,
      });
      await Promise.all([refreshUser?.(), fetchPet?.()]);
      toast.success(`Frenzy complete! Earned +${res.rewards?.coins || earnedCoins} coins! 🐾`);
    } catch (err) {
      console.warn('Reward notice:', err.message);
      setRewards({ coins: earnedCoins, xp: earnedXP });
    }
  }, [refreshUser, fetchPet]);

  // Target spawning and disappearing
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      // Pick random empty hole
      const emptyIndices = [];
      activeHoles.forEach((val, idx) => {
        if (!val) emptyIndices.push(idx);
      });

      if (emptyIndices.length > 0) {
        const randomHole = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const target = HOLE_TARGETS[Math.floor(Math.random() * HOLE_TARGETS.length)];

        setActiveHoles((prev) => {
          const next = [...prev];
          next[randomHole] = {
            ...target,
            id: `target-${Date.now()}-${randomHole}`,
          };
          return next;
        });

        // Auto hide after 900ms - 1300ms
        const hideTimeout = setTimeout(() => {
          setActiveHoles((prev) => {
            const next = [...prev];
            if (next[randomHole]?.id.includes(`${randomHole}`)) {
              next[randomHole] = null;
            }
            return next;
          });
        }, 1100);

        return () => clearTimeout(hideTimeout);
      }
    }, 600);

    return () => clearInterval(spawnInterval);
  }, [gameState, activeHoles]);

  // Tap hole target
  const handleWhack = (index, e) => {
    if (gameState !== 'playing') return;
    const target = activeHoles[index];
    if (!target) return;

    // Clear target from hole
    setActiveHoles((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });

    const now = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    if (target.isBad) {
      // Alarm Clock: penalty
      setScore((s) => Math.max(0, s - 15));
      setCombo(0);
      comboRef.current = 0;
      setPops((p) => [...p, { id: `pop-${now}`, x, y, text: '-15 ⏰', color: '#FF5252' }]);
    } else {
      // Good hit!
      const currentCombo = comboRef.current;
      const multiplier = currentCombo >= 10 ? 2.5 : currentCombo >= 5 ? 1.8 : 1.0;
      const earned = Math.round(target.points * multiplier);

      setScore((s) => s + earned);
      setCombo((c) => c + 1);
      comboRef.current = currentCombo + 1;
      setPops((p) => [
        ...p,
        {
          id: `pop-${now}`,
          x,
          y,
          text: `+${earned}!`,
          color: target.points >= 20 ? '#FFD54F' : '#69F0AE',
        },
      ]);
    }

    // Clean pops
    setTimeout(() => {
      setPops((prev) => prev.filter((p) => p.id !== `pop-${now}`));
    }, 600);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-soft border border-cream-dark space-y-4">
      {/* ─── HEADER ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-2xl bg-cream hover:bg-cream-dark text-ink transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink flex items-center gap-2">
              <span>🐾 Paw Pop Frenzy</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-lavender/30 text-lavender-dark font-bold border border-lavender/50">
                Talking Tom Whack
              </span>
            </h2>
            <p className="text-xs text-ink-muted">
              Tap cheeky mice, fish, and snacks before they hide! Avoid alarm clocks!
            </p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200 text-amber-700 font-bold text-sm">
              <Timer className="w-4 h-4 text-amber-600" />
              <span>{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-1 bg-lavender/30 px-3.5 py-1.5 rounded-2xl border border-lavender/50 text-ink font-bold text-sm">
              <Trophy className="w-4 h-4 text-lavender-dark" />
              <span>{score}</span>
            </div>
          </div>
        )}
      </div>

      {/* ─── 3x3 HOLE GRID ─── */}
      <div className="relative w-full h-[380px] sm:h-[420px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#E8F5E9] via-[#C8E6C9] to-[#A5D6A7] border-3 border-cream-dark p-6 flex items-center justify-center">
        {/* Floating Pops */}
        {pops.map((p) => (
          <div
            key={p.id}
            className="fixed text-lg font-black pointer-events-none animate-float z-50"
            style={{
              left: `${p.x}px`,
              top: `${p.y - 20}px`,
              color: p.color,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            {p.text}
          </div>
        ))}

        {/* Combo banner */}
        {combo >= 3 && gameState === 'playing' && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-lavender to-peach text-ink text-xs font-black px-4 py-1 rounded-full shadow-card animate-pulse border border-white z-20">
            🔥 {combo}x COMBO STREAK!
          </div>
        )}

        {/* Ready Overlay */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30 animate-fade-in">
            <div className="text-6xl mb-3 animate-bounce-gentle">🐭🐾⏰</div>
            <h3 className="font-display text-2xl font-bold text-ink mb-2">
              Paw Pop Whack-a-Mouse!
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted max-w-sm mb-6">
              Tap mice and snacks as fast as you can when they peek out of their cozy holes! Keep the combo going!
            </p>
            <Button variant="primary" size="lg" onClick={startGame} icon={Zap}>
              Start Tapping! 🐾
            </Button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30 animate-pop-in">
            <div className="text-5xl mb-2">🏆🐾</div>
            <h3 className="font-display text-2xl font-bold text-ink mb-1">
              Frenzy Finished!
            </h3>
            <p className="text-sm font-semibold text-ink-muted mb-4">
              Final Score: <span className="text-lavender-dark font-extrabold text-xl">{score} pts</span>
            </p>

            {rewards && (
              <div className="flex items-center gap-4 bg-cream/80 border border-cream-dark px-5 py-2.5 rounded-2xl mb-5 shadow-xs">
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

        {/* 3x3 Grid of Cushion Holes */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-sm">
          {activeHoles.map((target, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => handleWhack(idx, e)}
              className="relative w-full aspect-square rounded-full bg-[#5D4037] border-4 border-[#8D6E63] shadow-inner flex items-center justify-center overflow-hidden cursor-pointer active:scale-90 transition-transform group"
            >
              {/* Hole depth shadow */}
              <div className="absolute inset-1 rounded-full bg-[#3E2723] opacity-80" />

              {/* Popping Target */}
              {target && (
                <div className="relative text-4xl sm:text-5xl animate-pop-in select-none drop-shadow-md">
                  {target.emoji}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
