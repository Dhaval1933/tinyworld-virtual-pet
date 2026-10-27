import React from 'react';

/**
 * Animated SVG Pet Avatar for TinyWorld companions.
 * Supports species: 'mochi', 'pebble', 'sprout' and states: 'idle', 'pet', 'feed', 'rest'.
 */

export function MochiCat({ state = 'idle', className = 'w-20 h-20' }) {
  const isSleeping = state === 'rest';
  const isEating = state === 'feed';
  const isHappy = state === 'pet';
  const isTalking = state === 'talking';

  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Floor Shadow */}
      <ellipse cx="40" cy="72" rx="26" ry="6" fill="rgba(52, 52, 71, 0.15)" />

      {/* Swishing Tail */}
      <path
        d="M 58 56 Q 72 50 68 38 Q 64 34 60 42"
        stroke="#FFCCAD"
        strokeWidth="6"
        strokeLinecap="round"
        className={isHappy || isTalking ? 'animate-wiggle' : ''}
      />

      {/* Main Body (Chubby Cream) */}
      <ellipse cx="40" cy="50" rx="24" ry="20" fill="#FFF8EE" />

      {/* Calico Spot */}
      <path d="M 48 38 Q 62 44 56 56 Q 46 56 46 44 Z" fill="#FFCCAD" />
      <path d="M 22 42 Q 28 42 28 50 Q 20 54 20 46 Z" fill="#DCD6FF" />

      {/* Head */}
      <circle cx="40" cy="34" r="20" fill="#FFF8EE" />

      {/* Left Ear */}
      <polygon points="24,24 22,8 36,18" fill="#FFCCAD" stroke="#B38052" strokeWidth="1" strokeLinejoin="round" />
      <polygon points="25,21 24,12 33,18" fill="#FF8A8A" opacity="0.6" />

      {/* Right Ear */}
      <polygon points="56,24 58,8 44,18" fill="#FFF8EE" stroke="#B38052" strokeWidth="1" strokeLinejoin="round" />
      <polygon points="55,21 56,12 47,18" fill="#FF8A8A" opacity="0.6" />

      {/* Cheeks / Blush */}
      <ellipse cx="26" cy="38" rx="3.5" ry="2" fill="#FF8A8A" opacity="0.55" />
      <ellipse cx="54" cy="38" rx="3.5" ry="2" fill="#FF8A8A" opacity="0.55" />

      {/* Eyes */}
      {isSleeping ? (
        // Closed Sleeping Eyes: ^ ^
        <>
          <path d="M 28 34 Q 32 30 36 34" stroke="#343447" strokeWidth="2" strokeLinecap="round" />
          <path d="M 44 34 Q 48 30 52 34" stroke="#343447" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : isHappy || isTalking ? (
        // Happy / Talking Sparkling Eyes
        <>
          <path d="M 28 33 Q 32 29 36 33" stroke="#343447" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 44 33 Q 48 29 52 33" stroke="#343447" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        // Curious Big Round Eyes
        <>
          <ellipse cx="32" cy="32" rx="3" ry="4" fill="#343447" />
          <circle cx="31" cy="30.5" r="1.2" fill="#FFFFFF" />
          <ellipse cx="48" cy="32" rx="3" ry="4" fill="#343447" />
          <circle cx="47" cy="30.5" r="1.2" fill="#FFFFFF" />
        </>
      )}

      {/* Nose & Mouth */}
      <polygon points="40,36 38,34 42,34" fill="#FF8A8A" />
      {isEating ? (
        <ellipse cx="40" cy="40" rx="3" ry="3.5" fill="#FF8A8A" />
      ) : isTalking ? (
        <ellipse cx="40" cy="39" rx="3.5" ry="3.2" fill="#FF8A8A" className="animate-pulse" />
      ) : (
        <path d="M 37 38 Q 40 40 40 37 Q 40 40 43 38" stroke="#343447" strokeWidth="1.5" strokeLinecap="round" />
      )}

      {/* Whiskers */}
      <line x1="24" y1="35" x2="14" y2="33" stroke="#9090A7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="24" y1="38" x2="14" y2="39" stroke="#9090A7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="56" y1="35" x2="66" y2="33" stroke="#9090A7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="56" y1="38" x2="66" y2="39" stroke="#9090A7" strokeWidth="1.2" strokeLinecap="round" />

      {/* Little Front Paws */}
      <ellipse cx="34" cy="66" rx="5" ry="3.5" fill="#FFF8EE" stroke="#E2BB93" strokeWidth="0.8" />
      <ellipse cx="46" cy="66" rx="5" ry="3.5" fill="#FFF8EE" stroke="#E2BB93" strokeWidth="0.8" />
    </svg>
  );
}

export function PebbleBunny({ state = 'idle', className = 'w-20 h-20' }) {
  const isSleeping = state === 'rest';
  const isEating = state === 'feed';
  const isHappy = state === 'pet';
  const isTalking = state === 'talking';

  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow */}
      <ellipse cx="40" cy="72" rx="24" ry="6" fill="rgba(52, 52, 71, 0.15)" />

      {/* Fluffy Round Body */}
      <circle cx="40" cy="52" r="20" fill="#FFFFFF" />

      {/* Fluffy Tail */}
      <circle cx="60" cy="54" r="6" fill="#F5EDDF" />

      {/* Head */}
      <circle cx="40" cy="36" r="18" fill="#FFFFFF" />

      {/* Lop Ears (Floppy Down) */}
      <path
        d="M 26 26 C 14 26 10 44 14 54 C 18 56 24 50 24 38 Z"
        fill="#FFFFFF"
        stroke="#E2BB93"
        strokeWidth="1"
      />
      <path
        d="M 22 30 C 16 30 14 42 16 50 C 18 52 22 48 22 38 Z"
        fill="#FFD88A"
        opacity="0.4"
      />

      <path
        d="M 54 26 C 66 26 70 44 66 54 C 62 56 56 50 56 38 Z"
        fill="#FFFFFF"
        stroke="#E2BB93"
        strokeWidth="1"
      />
      <path
        d="M 58 30 C 64 30 66 42 64 50 C 62 52 58 48 58 38 Z"
        fill="#FFD88A"
        opacity="0.4"
      />

      {/* Cheeks */}
      <ellipse cx="28" cy="40" rx="3.5" ry="2" fill="#FF8A8A" opacity="0.6" />
      <ellipse cx="52" cy="40" rx="3.5" ry="2" fill="#FF8A8A" opacity="0.6" />

      {/* Eyes */}
      {isSleeping ? (
        <>
          <path d="M 28 36 Q 32 32 36 36" stroke="#343447" strokeWidth="2" strokeLinecap="round" />
          <path d="M 44 36 Q 48 32 52 36" stroke="#343447" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : isHappy || isTalking ? (
        <>
          <path d="M 28 35 Q 32 31 36 35" stroke="#343447" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 44 35 Q 48 31 52 35" stroke="#343447" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="32" cy="34" rx="3" ry="3.8" fill="#343447" />
          <circle cx="31" cy="32.5" r="1.2" fill="#FFFFFF" />
          <ellipse cx="48" cy="34" rx="3" ry="3.8" fill="#343447" />
          <circle cx="47" cy="32.5" r="1.2" fill="#FFFFFF" />
        </>
      )}

      {/* Twitchy Pink Nose & Mouth */}
      <ellipse cx="40" cy="38" rx="2" ry="1.5" fill="#FF8A8A" />
      {isEating ? (
        <circle cx="40" cy="42" r="3" fill="#FF8A8A" />
      ) : isTalking ? (
        <ellipse cx="40" cy="42" rx="3.5" ry="3" fill="#FF8A8A" className="animate-pulse" />
      ) : (
        <path d="M 38 41 Q 40 43 40 39 Q 40 43 42 41" stroke="#343447" strokeWidth="1.2" strokeLinecap="round" />
      )}

      {/* Front Paws */}
      <circle cx="35" cy="65" r="4" fill="#FFFFFF" stroke="#E2BB93" strokeWidth="0.8" />
      <circle cx="45" cy="65" r="4" fill="#FFFFFF" stroke="#E2BB93" strokeWidth="0.8" />
    </svg>
  );
}

export function SproutPet({ state = 'idle', className = 'w-20 h-20' }) {
  const isSleeping = state === 'rest';
  const isEating = state === 'feed';
  const isHappy = state === 'pet';
  const isTalking = state === 'talking';

  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow */}
      <ellipse cx="40" cy="72" rx="22" ry="5.5" fill="rgba(52, 52, 71, 0.15)" />

      {/* Plant Antenna Sprout on Head */}
      <path
        d="M 40 22 Q 38 12 34 8 Q 30 14 36 18 Q 40 20 40 22"
        fill="#4CB87A"
      />
      <path
        d="M 40 22 Q 44 14 50 12 Q 48 18 42 20"
        fill="#7DD4A0"
      />
      <circle cx="40" cy="8" r="3" fill={isHappy || isTalking ? '#FFD54F' : '#7DD4A0'} className={isHappy || isTalking ? 'animate-sparkle' : ''} />

      {/* Round Green Bulb Body */}
      <ellipse cx="40" cy="48" rx="22" ry="22" fill="#CFE3C1" />

      {/* Golden Heart Tummy Glow */}
      <ellipse cx="40" cy="54" rx="12" ry="10" fill="#FFF2DF" opacity="0.85" />
      <path d="M 40 50 Q 37 46 34 49 Q 34 54 40 58 Q 46 54 46 49 Q 43 46 40 50 Z" fill="#FFCCAD" opacity="0.6" />

      {/* Cheeks */}
      <ellipse cx="26" cy="44" rx="3.5" ry="2" fill="#FF8A8A" opacity="0.6" />
      <ellipse cx="54" cy="44" rx="3.5" ry="2" fill="#FF8A8A" opacity="0.6" />

      {/* Eyes */}
      {isSleeping ? (
        <>
          <path d="M 28 39 Q 32 35 36 39" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" />
          <path d="M 44 39 Q 48 35 52 39" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : isHappy || isTalking ? (
        <>
          <path d="M 28 38 Q 32 33 36 38" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 44 38 Q 48 33 52 38" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="32" cy="38" r="3.5" fill="#2D6A4F" />
          <circle cx="31" cy="36.5" r="1.2" fill="#FFFFFF" />
          <circle cx="48" cy="38" r="3.5" fill="#2D6A4F" />
          <circle cx="47" cy="36.5" r="1.2" fill="#FFFFFF" />
        </>
      )}

      {/* Mouth */}
      {isEating ? (
        <circle cx="40" cy="45" r="3" fill="#2D6A4F" />
      ) : isTalking ? (
        <ellipse cx="40" cy="44" rx="3.5" ry="3" fill="#2D6A4F" className="animate-pulse" />
      ) : (
        <path d="M 38 43 Q 40 45 42 43" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" />
      )}

      {/* Petal Feet */}
      <ellipse cx="32" cy="68" rx="5" ry="3" fill="#A8CC8F" />
      <ellipse cx="48" cy="68" rx="5" ry="3" fill="#A8CC8F" />
    </svg>
  );
}

/**
 * Universal Pet Avatar with animations, mood effects, and speech bubbles.
 */
export default function PetAvatar({
  species = 'mochi',
  state = 'idle',
  speech = '',
  onClick,
  className = '',
}) {
  const renderPet = () => {
    switch (species) {
      case 'pebble':
        return <PebbleBunny state={state} className="w-20 h-20 md:w-24 md:h-24" />;
      case 'sprout':
        return <SproutPet state={state} className="w-20 h-20 md:w-24 md:h-24" />;
      case 'mochi':
      default:
        return <MochiCat state={state} className="w-20 h-20 md:w-24 md:h-24" />;
    }
  };

  const getAnimClass = () => {
    if (state === 'pet') return 'animate-wiggle scale-105';
    if (state === 'feed') return 'animate-bounce-gentle scale-105';
    if (state === 'talking') return 'animate-bounce-gentle scale-105';
    if (state === 'rest') return 'animate-pulse-soft';
    return 'animate-float';
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-block cursor-pointer select-none transition-transform duration-300 ${getAnimClass()} ${className}`}
    >
      {/* Dynamic Overhead Speech Bubble */}
      {speech && (
        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-max max-w-[260px] sm:max-w-xs md:max-w-sm bg-white/95 backdrop-blur-xs text-ink text-xs font-bold px-3.5 py-2 rounded-2xl shadow-card border border-cream-dark text-center leading-snug whitespace-normal break-words animate-pop-in z-[100] pointer-events-none">
          {speech}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-cream-dark" />
        </div>
      )}

      {/* Floating State Effects */}
      {state === 'talking' && (
        <div className="absolute -top-3 right-0 text-xl animate-bounce-gentle pointer-events-none">
          🎶
        </div>
      )}
      {state === 'pet' && (
        <div className="absolute -top-3 right-0 text-xl animate-float pointer-events-none">
          💕
        </div>
      )}
      {state === 'feed' && (
        <div className="absolute -top-3 left-0 text-xl animate-bounce-gentle pointer-events-none">
          🍓
        </div>
      )}
      {state === 'rest' && (
        <div className="absolute -top-4 right-1 text-sm font-bold text-lavender-dark animate-float pointer-events-none">
          💤 Zzz
        </div>
      )}

      {renderPet()}
    </div>
  );
}
