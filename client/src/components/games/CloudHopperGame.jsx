import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { activityService } from '../../services';
import Button from '../common/Button';
import {
  Trophy,
  Zap,
  RotateCcw,
  ArrowLeft,
  Coins,
  Star,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CloudHopperGame({ onBack }) {
  const { user, refreshUser } = useAuth();
  const { pet, fetchPet } = useGame();

  const [gameState, setGameState] = useState('ready'); // 'ready' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [petY, setPetY] = useState(180);
  const [cloudPillars, setCloudPillars] = useState([]);
  const [rewards, setRewards] = useState(null);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const petYRef = useRef(180);
  const velocityRef = useRef(0);
  const scoreRef = useRef(0);
  const pillarsRef = useRef([]);
  const lastPillarSpawnRef = useRef(0);

  const GRAVITY = 0.32;
  const JUMP_IMPULSE = -6.2;
  const GAP_HEIGHT = 135;

  const flap = () => {
    if (gameState === 'ready') {
      startGame();
      velocityRef.current = JUMP_IMPULSE;
      return;
    }
    if (gameState === 'playing') {
      velocityRef.current = JUMP_IMPULSE;
    }
  };

  const startGame = () => {
    setScore(0);
    setPetY(180);
    setCloudPillars([]);
    setRewards(null);
    petYRef.current = 180;
    velocityRef.current = JUMP_IMPULSE;
    scoreRef.current = 0;
    pillarsRef.current = [];
    lastPillarSpawnRef.current = Date.now();
    setGameState('playing');
  };

  // Keyboard controls (Space or ArrowUp)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const endGame = useCallback(async () => {
    setGameState('gameover');
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const finalScore = scoreRef.current;
    const earnedCoins = Math.min(30, Math.max(10, Math.floor(finalScore * 2.5)));
    const earnedXP = Math.min(35, Math.max(15, Math.floor(finalScore * 3)));

    try {
      const idempotencyKey = `cloud-hopper-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const res = await activityService.complete({
        activityType: 'mini-game',
        title: `Cloud Hopper: Flew through ${finalScore} clouds`,
        note: `Flappy Pet jump mini-game!`,
        durationMinutes: 2,
        idempotencyKey,
      });

      setRewards({
        coins: res.rewards?.coins || earnedCoins,
        xp: res.rewards?.xp || earnedXP,
      });
      await Promise.all([refreshUser?.(), fetchPet?.()]);
      toast.success(`Cloud jump complete! Earned +${res.rewards?.coins || earnedCoins} coins! 🪽`);
    } catch (err) {
      console.warn('Reward notice:', err.message);
      setRewards({ coins: earnedCoins, xp: earnedXP });
    }
  }, [refreshUser, fetchPet]);

  // 60fps Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let running = true;

    const loop = () => {
      if (!running) return;

      const now = Date.now();
      const canvasHeight = 400;
      const canvasWidth = 600;

      // Apply physics to pet
      velocityRef.current += GRAVITY;
      petYRef.current += velocityRef.current;

      // Floor & Ceiling bounds
      if (petYRef.current > canvasHeight - 45 || petYRef.current < 5) {
        endGame();
        return;
      }
      setPetY(petYRef.current);

      // Spawn cloud pillars every 1500ms
      if (now - lastPillarSpawnRef.current > 1500) {
        const topHeight = 50 + Math.random() * 150;
        const newPillar = {
          id: `pillar-${now}`,
          x: canvasWidth,
          topHeight,
          bottomY: topHeight + GAP_HEIGHT,
          passed: false,
        };
        pillarsRef.current.push(newPillar);
        lastPillarSpawnRef.current = now;
      }

      // Move pillars and check collision
      const petRadius = 18;
      const petX = 90; // Fixed horizontal position of pet

      pillarsRef.current = pillarsRef.current
        .map((p) => ({ ...p, x: p.x - 2.8 }))
        .filter((p) => {
          // Score when passing pillar
          if (!p.passed && p.x + 40 < petX) {
            p.passed = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);
          }

          // Check collision
          const withinX = petX + petRadius > p.x && petX - petRadius < p.x + 55;
          if (withinX) {
            const hitTop = petYRef.current - petRadius < p.topHeight;
            const hitBottom = petYRef.current + petRadius > p.bottomY;
            if (hitTop || hitBottom) {
              endGame();
              return false;
            }
          }

          return p.x > -80;
        });

      setCloudPillars([...pillarsRef.current]);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, endGame]);

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
              <span>🪽 Cloud Hopper</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold border border-sky-200">
                Flappy Pet Style
              </span>
            </h2>
            <p className="text-xs text-ink-muted">
              Tap or press Space to flap through fluffy cloud gates!
            </p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-sky-50 px-3.5 py-1.5 rounded-2xl border border-sky-200 text-ink font-bold text-sm">
              <Trophy className="w-4 h-4 text-sky-600" />
              <span>Clouds: {score}</span>
            </div>
          </div>
        )}
      </div>

      {/* ─── SKY CANVAS ─── */}
      <div
        ref={canvasRef}
        onClick={flap}
        className="relative w-full h-[400px] rounded-3xl overflow-hidden select-none bg-gradient-to-b from-[#81D4FA] via-[#B3E5FC] to-[#E1F5FE] border-3 border-cream-dark shadow-inner cursor-pointer"
        style={{ touchAction: 'none' }}
      >
        {/* Floating background clouds */}
        <div className="absolute top-6 left-1/4 text-4xl opacity-50 animate-float">☁️</div>
        <div className="absolute top-20 right-1/4 text-5xl opacity-45 animate-float" style={{ animationDelay: '2s' }}>☁️</div>

        {/* Ready Overlay */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30 animate-fade-in">
            <div className="text-6xl mb-3 animate-bounce-gentle">🪽☁️✨</div>
            <h3 className="font-display text-2xl font-bold text-ink mb-2">
              Cloud Hopper Flight!
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted max-w-sm mb-6">
              Tap anywhere or press Spacebar to flap your pet's little wings through the pastel cloud gates!
            </p>
            <Button variant="accent" size="lg" onClick={startGame} icon={Zap}>
              Tap to Fly! 🪽
            </Button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30 animate-pop-in">
            <div className="text-5xl mb-2">☁️🪽</div>
            <h3 className="font-display text-2xl font-bold text-ink mb-1">
              Flight Complete!
            </h3>
            <p className="text-sm font-semibold text-ink-muted mb-4">
              Gates Passed: <span className="text-sky-700 font-extrabold text-xl">{score}</span>
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
                Fly Again
              </Button>
              {onBack && (
                <Button variant="ghost" size="md" onClick={onBack}>
                  All Games
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Cloud Pillars */}
        {cloudPillars.map((p) => (
          <React.Fragment key={p.id}>
            {/* Top Cloud Pillar */}
            <div
              className="absolute w-14 bg-gradient-to-b from-white/95 to-sky-100/90 rounded-b-3xl border-2 border-white shadow-md flex items-end justify-center pb-2"
              style={{
                left: `${p.x}px`,
                top: 0,
                height: `${p.topHeight}px`,
              }}
            >
              <span className="text-xs">☁️</span>
            </div>

            {/* Bottom Cloud Pillar */}
            <div
              className="absolute w-14 bg-gradient-to-t from-white/95 to-sky-100/90 rounded-t-3xl border-2 border-white shadow-md flex items-start justify-center pt-2"
              style={{
                left: `${p.x}px`,
                top: `${p.bottomY}px`,
                bottom: 0,
              }}
            >
              <span className="text-xs">☁️</span>
            </div>
          </React.Fragment>
        ))}

        {/* The Flapping Pet Avatar */}
        <div
          className="absolute select-none pointer-events-none transition-transform"
          style={{
            left: '90px',
            top: `${petY}px`,
            transform: `translate(-50%, -50%) rotate(${Math.min(30, Math.max(-30, velocityRef.current * 4))}deg)`,
          }}
        >
          <div className="text-4xl filter drop-shadow-md">
            {pet?.species === 'mochi' ? '🐱' : pet?.species === 'pebble' ? '🐰' : '🌱'}
          </div>
        </div>
      </div>
    </div>
  );
}
