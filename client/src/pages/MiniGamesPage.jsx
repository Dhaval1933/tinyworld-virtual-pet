import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import TreatCatchGame from '../components/games/TreatCatchGame';
import PawPopGame from '../components/games/PawPopGame';
import CloudHopperGame from '../components/games/CloudHopperGame';
import PetAvatar from '../components/room/PetAvatar';
import Button from '../components/common/Button';
import { Gamepad2, Coins, Star, Sparkles, Play, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const GAMES = [
  {
    id: 'treat-catch',
    title: 'Treat Catch Frenzy',
    subtitle: 'Talking Tom Food Drop',
    icon: '🍓',
    badge: 'Popular',
    description: 'Catch delicious falling strawberries, fish, and cakes in your pet’s basket. Watch out for dirty boots!',
    bgColor: 'from-peach/25 via-cream to-peach/10',
    borderColor: 'border-peach/40',
    rewardText: 'Up to 30 Coins & 35 XP',
  },
  {
    id: 'paw-pop',
    title: 'Paw Pop Frenzy',
    subtitle: 'Talking Tom Whack-a-Mouse',
    icon: '🐾',
    badge: 'Fast-Paced',
    description: 'Test your reflexes! Tap cheeky garden mice and golden fish as fast as they pop out of cozy holes.',
    bgColor: 'from-lavender/25 via-cream to-lavender/10',
    borderColor: 'border-lavender/40',
    rewardText: 'Up to 30 Coins & 35 XP',
  },
  {
    id: 'cloud-hopper',
    title: 'Cloud Hopper',
    subtitle: 'Flappy Pet Flight',
    icon: '🪽',
    badge: 'New',
    description: 'Tap or press Space to flap through fluffy pastel cloud gates and navigate the endless sky.',
    bgColor: 'from-sky/25 via-cream to-sky/10',
    borderColor: 'border-sky/40',
    rewardText: 'Up to 30 Coins & 35 XP',
  },
];

export default function MiniGamesPage() {
  const { user } = useAuth();
  const { pet } = useGame();
  const [selectedGame, setSelectedGame] = useState(null);

  if (selectedGame === 'treat-catch') {
    return <TreatCatchGame onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === 'paw-pop') {
    return <PawPopGame onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === 'cloud-hopper') {
    return <CloudHopperGame onBack={() => setSelectedGame(null)} />;
  }

  return (
    <div className="page-enter space-y-6">
      {/* ─── HEADER ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-xs p-5 rounded-3xl border border-cream-dark shadow-soft">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink flex items-center gap-2">
            <span>Arcade & Mini-Games</span>
            <span className="text-xl">🎮</span>
          </h1>
          <p className="text-xs text-ink-muted">
            Play classic Talking Tom mini-games with {pet?.name || 'your pet'} to earn coins, XP, and happiness!
          </p>
        </div>

        {/* Currency & Level Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-cream/70 rounded-2xl px-3.5 py-1.5 border border-cream-dark">
            <Coins className="w-4 h-4 text-peach-dark" />
            <span className="font-bold text-sm text-ink">{user?.coins ?? 0}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-lavender/30 rounded-2xl px-3.5 py-1.5 border border-lavender/50">
            <Star className="w-4 h-4 text-lavender-dark" />
            <span className="font-bold text-sm text-ink">Lv. {user?.level ?? 1}</span>
          </div>
        </div>
      </div>

      {/* ─── PET CHEERING BANNER ─── */}
      {pet && (
        <div className="flex items-center gap-4 bg-gradient-to-r from-lavender/25 via-cream to-peach/20 p-4 rounded-3xl border border-lavender/30 shadow-xs">
          <PetAvatar species={pet.species} state="pet" className="w-16 h-16 pointer-events-none" />
          <div className="flex-1">
            <h3 className="font-display font-bold text-ink text-sm sm:text-base flex items-center gap-1.5">
              <span>{pet.name} is ready to play!</span>
              <span>🎉</span>
            </h3>
            <p className="text-xs text-ink-muted">
              "Which game should we play first? I love catching strawberries!"
            </p>
          </div>
          <Link to="/room">
            <Button variant="outline" size="sm" icon={ArrowLeft}>
              Back to Room
            </Button>
          </Link>
        </div>
      )}

      {/* ─── GAMES CARDS GRID ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {GAMES.map((game) => (
          <div
            key={game.id}
            className={`bg-gradient-to-b ${game.bgColor} rounded-3xl p-5 border ${game.borderColor} shadow-soft flex flex-col justify-between hover:shadow-card hover:-translate-y-1 transition-all duration-300 group`}
          >
            <div>
              {/* Badge & Emoji */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl group-hover:scale-110 transition-transform select-none">
                  {game.icon}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/80 text-ink shadow-2xs border border-white">
                  {game.badge}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h2 className="font-display text-lg font-bold text-ink mb-0.5">
                {game.title}
              </h2>
              <p className="text-xs font-bold text-lavender-dark mb-2">
                {game.subtitle}
              </p>

              {/* Description */}
              <p className="text-xs text-ink-muted leading-relaxed mb-4">
                {game.description}
              </p>
            </div>

            {/* Rewards Pill & Action Button */}
            <div className="space-y-3 pt-3 border-t border-black/5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
                <Sparkles className="w-3.5 h-3.5 text-peach-dark" />
                <span>Rewards: {game.rewardText}</span>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => setSelectedGame(game.id)}
                icon={Play}
                className="w-full"
              >
                Play Now
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
