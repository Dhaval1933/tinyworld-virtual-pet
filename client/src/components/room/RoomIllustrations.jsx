import React from 'react';

/**
 * High-quality cozy vector illustrations for TinyWorld furniture and decorations.
 * Designed with a consistent cozy pastel palette and soft rounded aesthetic.
 */

export function BedIllustration({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 90 70"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Floor Shadow */}
      <ellipse cx="45" cy="58" rx="38" ry="8" fill="rgba(52, 52, 71, 0.12)" />

      {/* Bed Wooden Frame */}
      <rect x="12" y="25" width="66" height="32" rx="6" fill="#D7A97B" />
      <rect x="14" y="27" width="62" height="28" rx="4" fill="#C49363" />

      {/* Headboard Posts */}
      <rect x="8" y="10" width="8" height="48" rx="3" fill="#B38052" />
      <circle cx="12" cy="10" r="4.5" fill="#E2BB93" />
      <rect x="74" y="10" width="8" height="48" rx="3" fill="#B38052" />
      <circle cx="78" cy="10" r="4.5" fill="#E2BB93" />

      {/* Headboard backrest */}
      <rect x="14" y="15" width="62" height="15" rx="3" fill="#D7A97B" />
      <rect x="18" y="18" width="54" height="9" rx="2" fill="#E2BB93" />

      {/* Mattress */}
      <rect x="16" y="28" width="58" height="22" rx="4" fill="#FFFDF8" />

      {/* Pillow */}
      <rect x="22" y="22" width="28" height="14" rx="5" fill="#FFF2E0" />
      <path d="M 28 29 Q 36 32 44 29" stroke="#E6DAC8" strokeWidth="1.5" strokeLinecap="round" />

      {/* Cozy Quilt */}
      <path
        d="M 16 34 Q 45 32 74 34 L 74 48 Q 45 52 16 48 Z"
        fill="#DCD6FF"
      />
      {/* Quilt Fold Trim */}
      <path
        d="M 16 34 Q 45 32 74 34 L 74 38 Q 45 36 16 38 Z"
        fill="#FFCCAD"
      />
      {/* Quilt Stitch Detail */}
      <path
        d="M 24 41 L 66 41 M 30 45 L 60 45"
        stroke="#B8AEFF"
        strokeWidth="1.2"
        strokeDasharray="2 2"
        strokeLinecap="round"
      />

      {/* Footboard Posts */}
      <rect x="10" y="38" width="6" height="20" rx="2" fill="#B38052" />
      <rect x="74" y="38" width="6" height="20" rx="2" fill="#B38052" />
    </svg>
  );
}

export function SofaIllustration({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 96 64"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow */}
      <ellipse cx="48" cy="54" rx="42" ry="7" fill="rgba(52, 52, 71, 0.12)" />

      {/* Wooden Legs */}
      <rect x="18" y="44" width="5" height="12" rx="2" fill="#B38052" transform="rotate(8 18 44)" />
      <rect x="73" y="44" width="5" height="12" rx="2" fill="#B38052" transform="rotate(-8 73 44)" />

      {/* Sofa Backrest */}
      <rect x="10" y="14" width="76" height="32" rx="14" fill="#DCD6FF" />
      <rect x="14" y="17" width="68" height="26" rx="10" fill="#CEC7FA" />

      {/* Backrest Tufting */}
      <circle cx="32" cy="24" r="2.5" fill="#B8AEFF" />
      <circle cx="48" cy="24" r="2.5" fill="#B8AEFF" />
      <circle cx="64" cy="24" r="2.5" fill="#B8AEFF" />

      {/* Seat Cushion */}
      <rect x="12" y="30" width="72" height="18" rx="8" fill="#E8E4FF" />
      <line x1="48" y1="30" x2="48" y2="48" stroke="#CEC7FA" strokeWidth="2" strokeLinecap="round" />

      {/* Armrests */}
      <rect x="6" y="24" width="14" height="24" rx="7" fill="#C4BCF7" />
      <rect x="76" y="24" width="14" height="24" rx="7" fill="#C4BCF7" />

      {/* Throw Cushions */}
      {/* Left Cushion (Sage) */}
      <rect x="18" y="26" width="16" height="16" rx="4" fill="#CFE3C1" transform="rotate(-10 18 26)" />
      {/* Right Cushion (Peach) */}
      <rect x="62" y="27" width="16" height="16" rx="4" fill="#FFCCAD" transform="rotate(12 62 27)" />
    </svg>
  );
}

export function DeskIllustration({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 80 70"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow */}
      <ellipse cx="40" cy="62" rx="32" ry="6" fill="rgba(52, 52, 71, 0.12)" />

      {/* Desk Legs */}
      <rect x="14" y="28" width="5" height="34" rx="2" fill="#B38052" />
      <rect x="61" y="28" width="5" height="34" rx="2" fill="#B38052" />
      <rect x="18" y="28" width="4" height="32" rx="2" fill="#996D44" />
      <rect x="58" y="28" width="4" height="32" rx="2" fill="#996D44" />

      {/* Desk Tabletop */}
      <rect x="10" y="24" width="60" height="9" rx="3" fill="#D7A97B" />
      <rect x="12" y="25" width="56" height="4" rx="1.5" fill="#E8C59F" />

      {/* Drawer */}
      <rect x="42" y="32" width="22" height="11" rx="2" fill="#C49363" />
      <circle cx="53" cy="37.5" r="2" fill="#FFE082" />

      {/* Desk Lamp */}
      <rect x="18" y="20" width="10" height="4" rx="1" fill="#757575" />
      <path d="M 23 20 Q 20 10 26 8" stroke="#FFCCAD" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 24 5 L 34 10 L 28 14 Z" fill="#FFA726" />
      {/* Lamp Light Glow */}
      <polygon points="30,12 48,24 26,24" fill="rgba(255, 238, 88, 0.25)" />

      {/* Notebook / Books on desk */}
      <rect x="36" y="20" width="14" height="4" rx="1" fill="#CFE3C1" />
      <rect x="38" y="17" width="10" height="3" rx="0.8" fill="#DCD6FF" />
      <line x1="53" y1="18" x2="57" y2="23" stroke="#FF7043" strokeWidth="1.5" strokeLinecap="round" />

      {/* Stool */}
      <ellipse cx="40" cy="53" rx="12" ry="4" fill="#C49363" />
      <rect x="33" y="53" width="3" height="11" rx="1" fill="#996D44" />
      <rect x="44" y="53" width="3" height="11" rx="1" fill="#996D44" />
    </svg>
  );
}

export function BookshelfIllustration({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 65 85"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow */}
      <ellipse cx="32" cy="78" rx="26" ry="5" fill="rgba(52, 52, 71, 0.12)" />

      {/* Outer Case */}
      <rect x="8" y="10" width="48" height="68" rx="4" fill="#D7A97B" />
      <rect x="11" y="13" width="42" height="62" rx="2" fill="#B38052" />

      {/* Shelves */}
      <rect x="11" y="32" width="42" height="4" fill="#D7A97B" />
      <rect x="11" y="52" width="42" height="4" fill="#D7A97B" />

      {/* Top Shelf Books & Crystal */}
      <rect x="14" y="18" width="5" height="14" rx="1" fill="#FF8A8A" />
      <rect x="20" y="16" width="6" height="16" rx="1" fill="#DCD6FF" />
      <rect x="27" y="19" width="5" height="13" rx="1" fill="#7DD4A0" />
      <circle cx="44" cy="25" r="4" fill="#CDEBFA" opacity="0.8" />
      <polygon points="44,21 47,26 44,29 41,26" fill="#FFFFFF" opacity="0.6" />

      {/* Middle Shelf Books (Tilted) */}
      <rect x="14" y="37" width="5" height="15" rx="1" fill="#FFA726" />
      <rect x="20" y="39" width="6" height="13" rx="1" fill="#CDEBFA" />
      <rect x="27" y="38" width="5" height="14" rx="1" fill="#FFCCAD" />
      <rect x="33" y="38" width="5" height="14" rx="1" fill="#DCD6FF" />
      {/* Tilted book */}
      <rect x="40" y="38" width="4" height="14" rx="1" fill="#CFE3C1" transform="rotate(18 40 38)" />

      {/* Bottom Shelf Storage Box / Big Books */}
      <rect x="14" y="58" width="18" height="14" rx="3" fill="#E2BB93" />
      <circle cx="23" cy="65" r="1.5" fill="#B38052" />
      <rect x="35" y="57" width="7" height="15" rx="1.5" fill="#9DD5F3" />
      <rect x="43" y="56" width="6" height="16" rx="1.5" fill="#B8AEFF" />
    </svg>
  );
}

export function ArmchairIllustration({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 70 70"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow */}
      <ellipse cx="35" cy="60" rx="28" ry="6" fill="rgba(52, 52, 71, 0.12)" />

      {/* Peg Legs */}
      <rect x="18" y="48" width="4" height="12" rx="1.5" fill="#B38052" transform="rotate(10 18 48)" />
      <rect x="48" y="48" width="4" height="12" rx="1.5" fill="#B38052" transform="rotate(-10 48 48)" />

      {/* Backrest (Sage) */}
      <path
        d="M 12 36 C 12 16, 58 16, 58 36 C 58 48, 12 48, 12 36 Z"
        fill="#CFE3C1"
      />
      <path
        d="M 16 34 C 16 20, 54 20, 54 34"
        stroke="#A8CC8F"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Seat Cushion */}
      <ellipse cx="35" cy="42" rx="21" ry="11" fill="#E3F0DA" />

      {/* Knitted Blanket Throw */}
      <path
        d="M 36 28 Q 48 30 46 48 Q 42 52 38 48 Z"
        fill="#FFCCAD"
      />
      <circle cx="35" cy="30" r="2" fill="#A8CC8F" />
    </svg>
  );
}

export function PottedPlantIllustration({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 60 70"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow */}
      <ellipse cx="30" cy="62" rx="18" ry="5" fill="rgba(52, 52, 71, 0.12)" />

      {/* Terracotta Pot */}
      <polygon points="18,40 42,40 38,62 22,62" fill="#E07A5F" />
      <rect x="16" y="37" width="28" height="5" rx="2.5" fill="#F4A261" />

      {/* Leaves */}
      {/* Center Big Leaf */}
      <path
        d="M 30 38 Q 30 14 30 10 Q 38 18 36 30 Q 32 38 30 38 Z"
        fill="#4CB87A"
      />
      <path d="M 30 38 L 30 14" stroke="#2D6A4F" strokeWidth="1.2" strokeLinecap="round" />

      {/* Left Leaf */}
      <path
        d="M 28 38 Q 10 26 12 16 Q 24 20 28 34 Z"
        fill="#7DD4A0"
      />
      <path d="M 28 36 Q 16 24 15 20" stroke="#4CB87A" strokeWidth="1" strokeLinecap="round" />

      {/* Right Leaf */}
      <path
        d="M 32 38 Q 50 26 48 16 Q 36 20 32 34 Z"
        fill="#7DD4A0"
      />
      <path d="M 32 36 Q 44 24 45 20" stroke="#4CB87A" strokeWidth="1" strokeLinecap="round" />

      {/* Small Sprout */}
      <path
        d="M 29 40 Q 24 34 26 30 Q 30 32 29 40 Z"
        fill="#A8CC8F"
      />
    </svg>
  );
}

export function HangingIvyIllustration({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 50 75"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Wall Hook & Macrame Strings */}
      <circle cx="25" cy="5" r="2.5" fill="#B38052" />
      <line x1="25" y1="5" x2="16" y2="28" stroke="#D7A97B" strokeWidth="1.5" />
      <line x1="25" y1="5" x2="34" y2="28" stroke="#D7A97B" strokeWidth="1.5" />

      {/* Hanging Pot */}
      <ellipse cx="25" cy="28" rx="12" ry="4" fill="#F4A261" />
      <path d="M 13 28 Q 15 40 25 42 Q 35 40 37 28 Z" fill="#E07A5F" />

      {/* Trailing Vines */}
      <path d="M 18 36 Q 14 48 16 60 Q 18 68 15 72" stroke="#4CB87A" strokeWidth="1.5" fill="none" />
      <path d="M 30 36 Q 34 46 30 58 Q 28 66 32 70" stroke="#4CB87A" strokeWidth="1.5" fill="none" />
      <path d="M 24 38 Q 22 50 25 62" stroke="#2D6A4F" strokeWidth="1.2" fill="none" />

      {/* Ivy Leaves */}
      <circle cx="14" cy="48" r="3" fill="#7DD4A0" />
      <circle cx="18" cy="56" r="3.5" fill="#7DD4A0" />
      <circle cx="15" cy="65" r="2.5" fill="#A8CC8F" />

      <circle cx="32" cy="46" r="3" fill="#7DD4A0" />
      <circle cx="29" cy="54" r="3.5" fill="#7DD4A0" />
      <circle cx="31" cy="64" r="2.5" fill="#A8CC8F" />
    </svg>
  );
}

export function SucculentsIllustration({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 55 45"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="28" cy="38" rx="20" ry="4" fill="rgba(52, 52, 71, 0.12)" />

      {/* Ceramic Dish */}
      <rect x="8" y="24" width="40" height="12" rx="4" fill="#F5EDDF" stroke="#E2BB93" strokeWidth="1.5" />

      {/* Succulent 1 (Rosette - Mint) */}
      <circle cx="18" cy="22" r="6" fill="#7DD4A0" />
      <circle cx="18" cy="22" r="3.5" fill="#A8CC8F" />

      {/* Succulent 2 (Tall - Jade) */}
      <ellipse cx="28" cy="18" rx="4" ry="8" fill="#4CB87A" />
      <ellipse cx="28" cy="18" rx="2" ry="5" fill="#7DD4A0" />

      {/* Succulent 3 (Lilac echeveria) */}
      <circle cx="38" cy="22" r="5.5" fill="#DCD6FF" />
      <circle cx="38" cy="22" r="3" fill="#B8AEFF" />
    </svg>
  );
}

export function RugIllustration({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 110 65"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Fringe */}
      <ellipse cx="55" cy="32" rx="52" ry="29" stroke="#E2BB93" strokeWidth="2" strokeDasharray="3 3" />

      {/* Outer Ring (Peach) */}
      <ellipse cx="55" cy="32" rx="50" ry="27" fill="#FFCCAD" opacity="0.85" />

      {/* Middle Ring (Cream) */}
      <ellipse cx="55" cy="32" rx="38" ry="20" fill="#FFF8EE" />

      {/* Inner Accent Ring (Lavender) */}
      <ellipse cx="55" cy="32" rx="26" ry="14" fill="#DCD6FF" opacity="0.8" />

      {/* Center Core */}
      <ellipse cx="55" cy="32" rx="14" ry="7.5" fill="#FFCCAD" />
      <circle cx="55" cy="32" r="2" fill="#B8AEFF" />
    </svg>
  );
}

export function StarLampIllustration({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 45 65"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ambient Radial Glow */}
      <circle cx="22.5" cy="20" r="18" fill="rgba(255, 224, 130, 0.35)" />
      <circle cx="22.5" cy="20" r="10" fill="rgba(255, 238, 88, 0.4)" />

      {/* Floor Shadow */}
      <ellipse cx="22.5" cy="58" rx="12" ry="3.5" fill="rgba(52, 52, 71, 0.12)" />

      {/* Brass Stand */}
      <rect x="21" y="26" width="3" height="30" rx="1" fill="#D7A97B" />
      <ellipse cx="22.5" cy="56" rx="8" ry="2.5" fill="#B38052" />

      {/* Glowing Star Shape */}
      <polygon
        points="22.5,7 26.5,15 35,16.5 29,22.5 30.5,31 22.5,27 14.5,31 16,22.5 10,16.5 18.5,15"
        fill="#FFD54F"
        stroke="#FFA000"
        strokeWidth="1.5"
      />
      {/* Star sparkle highlight */}
      <polygon
        points="22.5,12 24.5,16 29,17 25.5,20 26.5,24 22.5,22 18.5,24 19.5,20 16,17 20.5,16"
        fill="#FFF9C4"
      />
    </svg>
  );
}

export function CurtainsIllustration({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 100 130"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ─── Wooden Curtain Rod & Finials ─── */}
      <rect x="2" y="6" width="96" height="5" rx="2.5" fill="#B38052" stroke="#8D5B28" strokeWidth="0.8" />
      <circle cx="2" cy="8.5" r="4.5" fill="#D7A97B" stroke="#8D5B28" strokeWidth="0.8" />
      <circle cx="98" cy="8.5" r="4.5" fill="#D7A97B" stroke="#8D5B28" strokeWidth="0.8" />
      {/* Rod Wall Brackets */}
      <rect x="14" y="4" width="4" height="9" rx="1.5" fill="#8D5B28" />
      <rect x="82" y="4" width="4" height="9" rx="1.5" fill="#8D5B28" />

      {/* ─── Top Scalloped Valance / Pelmet ─── */}
      <path
        d="M 6 10 Q 18 20 28 10 Q 39 20 50 10 Q 61 20 72 10 Q 82 20 94 10 L 94 8 L 6 8 Z"
        fill="#C3E4F7"
        stroke="#9ACBE7"
        strokeWidth="1"
      />
      <path
        d="M 8 10 Q 18 18 28 10 Q 39 18 50 10 Q 61 18 72 10 Q 82 18 92 10"
        stroke="#E6F5FC"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* ─── Left Curtain Drape ─── */}
      {/* Back Shadow */}
      <path
        d="M 8 10 C 14 38 4 75 8 124 C 18 126 26 122 28 116 C 18 70 28 35 24 10 Z"
        fill="#9ACBE7"
        opacity="0.3"
      />
      {/* Main Flowing Fabric */}
      <path
        d="M 8 10 C 18 35 6 68 10 122 C 16 125 24 122 26 114 C 16 68 26 34 22 10 Z"
        fill="#D6EEFA"
        stroke="#A5D4EC"
        strokeWidth="1"
      />
      {/* Inner Sheer Pleat Highlight */}
      <path
        d="M 12 11 C 18 40 10 70 14 118 C 17 121 21 119 22 112 C 16 70 21 38 18 11 Z"
        fill="#EBF6FC"
        opacity="0.9"
      />

      {/* Left Curtain Tieback Ribbon & Bow */}
      <rect x="4" y="62" width="18" height="5" rx="2.5" fill="#FFCCAD" stroke="#E2A682" strokeWidth="0.8" />
      <circle cx="13" cy="64.5" r="3.5" fill="#FFB7B2" stroke="#E2A682" strokeWidth="0.8" />
      <path d="M 11 67 L 8 74 M 15 67 L 18 74" stroke="#FFCCAD" strokeWidth="1.5" strokeLinecap="round" />

      {/* ─── Right Curtain Drape ─── */}
      {/* Back Shadow */}
      <path
        d="M 92 10 C 86 38 96 75 92 124 C 82 126 74 122 72 116 C 82 70 72 35 76 10 Z"
        fill="#9ACBE7"
        opacity="0.3"
      />
      {/* Main Flowing Fabric */}
      <path
        d="M 92 10 C 82 35 94 68 90 122 C 84 125 76 122 74 114 C 84 68 74 34 78 10 Z"
        fill="#D6EEFA"
        stroke="#A5D4EC"
        strokeWidth="1"
      />
      {/* Inner Sheer Pleat Highlight */}
      <path
        d="M 88 11 C 82 40 90 70 86 118 C 83 121 79 119 78 112 C 84 70 79 38 82 11 Z"
        fill="#EBF6FC"
        opacity="0.9"
      />

      {/* Right Curtain Tieback Ribbon & Bow */}
      <rect x="78" y="62" width="18" height="5" rx="2.5" fill="#FFCCAD" stroke="#E2A682" strokeWidth="0.8" />
      <circle cx="87" cy="64.5" r="3.5" fill="#FFB7B2" stroke="#E2A682" strokeWidth="0.8" />
      <path d="M 85 67 L 82 74 M 89 67 L 92 74" stroke="#FFCCAD" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function PhotoFrameIllustration({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 45 50"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hanging Wire */}
      <line x1="22.5" y1="4" x2="10" y2="14" stroke="#B38052" strokeWidth="1" />
      <line x1="22.5" y1="4" x2="35" y2="14" stroke="#B38052" strokeWidth="1" />
      <circle cx="22.5" cy="4" r="1.5" fill="#996D44" />

      {/* Frame */}
      <rect x="6" y="12" width="33" height="32" rx="3" fill="#D7A97B" stroke="#B38052" strokeWidth="1.5" />
      <rect x="10" y="16" width="25" height="24" rx="1.5" fill="#FFF8EE" />

      {/* Picture Canvas (Sunset & Tiny mountain) */}
      <rect x="12" y="18" width="21" height="20" rx="1" fill="#FFCCAD" />
      <circle cx="17" cy="24" r="3.5" fill="#FFE082" />
      <polygon points="12,38 21,29 27,38" fill="#7DD4A0" />
      <polygon points="23,38 28,32 33,38" fill="#CFE3C1" />
    </svg>
  );
}

export function CloudRugIllustration({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 120 70" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="38" rx="55" ry="26" fill="rgba(180, 215, 245, 0.3)" />
      <path
        d="M 30 46 C 18 46 12 36 22 28 C 18 16 32 10 44 18 C 52 8 68 8 76 18 C 88 10 102 16 98 28 C 108 36 102 46 90 46 Z"
        fill="#FFFFFF"
        stroke="#D2E7F7"
        strokeWidth="2.5"
      />
      <path
        d="M 34 42 C 24 42 20 34 28 28 C 24 19 36 14 46 20 C 53 12 67 12 74 20 C 84 14 96 19 92 28 C 100 34 96 42 86 42 Z"
        fill="#F0F8FF"
      />
      <polygon points="45,26 47,30 51,31 48,34 49,38 45,36 41,38 42,34 39,31 43,30" fill="#FFD54F" />
      <polygon points="75,24 76.5,27 79.5,27.5 77.5,29.5 78,32.5 75,31 72,32.5 72.5,29.5 70.5,27.5 73.5,27" fill="#FFD54F" />
      <circle cx="60" cy="32" r="2.5" fill="#B8AEFF" />
    </svg>
  );
}

export function DaisyRugIllustration({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 110 75" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="55" cy="18" rx="14" ry="12" fill="#FFFDF8" stroke="#E6DAC8" strokeWidth="1.5" />
      <ellipse cx="55" cy="56" rx="14" ry="12" fill="#FFFDF8" stroke="#E6DAC8" strokeWidth="1.5" />
      <ellipse cx="24" cy="37" rx="14" ry="12" fill="#FFFDF8" stroke="#E6DAC8" strokeWidth="1.5" />
      <ellipse cx="86" cy="37" rx="14" ry="12" fill="#FFFDF8" stroke="#E6DAC8" strokeWidth="1.5" />
      <ellipse cx="32" cy="24" rx="13" ry="11" fill="#FFFDF8" stroke="#E6DAC8" strokeWidth="1.5" />
      <ellipse cx="78" cy="24" rx="13" ry="11" fill="#FFFDF8" stroke="#E6DAC8" strokeWidth="1.5" />
      <ellipse cx="32" cy="50" rx="13" ry="11" fill="#FFFDF8" stroke="#E6DAC8" strokeWidth="1.5" />
      <ellipse cx="78" cy="50" rx="13" ry="11" fill="#FFFDF8" stroke="#E6DAC8" strokeWidth="1.5" />
      <ellipse cx="55" cy="37" rx="20" ry="15" fill="#FFE082" stroke="#FFCA28" strokeWidth="2" />
      <ellipse cx="55" cy="37" rx="14" ry="10" fill="#FFD54F" />
      <circle cx="50" cy="35" r="1.5" fill="#FFA000" />
      <circle cx="55" cy="39" r="1.5" fill="#FFA000" />
      <circle cx="60" cy="35" r="1.5" fill="#FFA000" />
    </svg>
  );
}

export function CatPawRugIllustration({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 110 80" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="55" cy="48" rx="42" ry="26" fill="#FFF5EC" stroke="#FFCCAD" strokeWidth="2.5" />
      <ellipse cx="30" cy="22" rx="9" ry="12" fill="#FFB7B2" transform="rotate(-15 30 22)" />
      <ellipse cx="46" cy="16" rx="9.5" ry="13" fill="#FFB7B2" transform="rotate(-5 46 16)" />
      <ellipse cx="64" cy="16" rx="9.5" ry="13" fill="#FFB7B2" transform="rotate(5 64 16)" />
      <ellipse cx="80" cy="22" rx="9" ry="12" fill="#FFB7B2" transform="rotate(15 80 22)" />
      <path
        d="M 36 44 C 36 34 50 36 55 40 C 60 36 74 34 74 44 C 74 58 64 64 55 64 C 46 64 36 58 36 44 Z"
        fill="#FFB7B2"
      />
      <ellipse cx="55" cy="50" rx="14" ry="10" fill="#FF9E99" opacity="0.6" />
    </svg>
  );
}

export function BohoRunnerIllustration({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 130 55" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="12" x2="6" y2="10" stroke="#C4A882" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="20" x2="5" y2="20" stroke="#C4A882" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="28" x2="4" y2="28" stroke="#C4A882" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="36" x2="5" y2="36" stroke="#C4A882" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="44" x2="6" y2="46" stroke="#C4A882" strokeWidth="2" strokeLinecap="round" />

      <line x1="118" y1="12" x2="124" y2="10" stroke="#C4A882" strokeWidth="2" strokeLinecap="round" />
      <line x1="118" y1="20" x2="125" y2="20" stroke="#C4A882" strokeWidth="2" strokeLinecap="round" />
      <line x1="118" y1="28" x2="126" y2="28" stroke="#C4A882" strokeWidth="2" strokeLinecap="round" />
      <line x1="118" y1="36" x2="125" y2="36" stroke="#C4A882" strokeWidth="2" strokeLinecap="round" />
      <line x1="118" y1="44" x2="124" y2="46" stroke="#C4A882" strokeWidth="2" strokeLinecap="round" />

      <rect x="12" y="10" width="106" height="36" rx="4" fill="#FAF6EE" stroke="#E2BB93" strokeWidth="1.5" />

      <path d="M 22 28 L 30 16 L 38 28 L 30 40 Z" fill="#DCD6FF" stroke="#B8AEFF" strokeWidth="1" />
      <path d="M 44 28 L 52 16 L 60 28 L 52 40 Z" fill="#FFCCAD" stroke="#E2A682" strokeWidth="1" />
      <path d="M 66 28 L 74 16 L 82 28 L 74 40 Z" fill="#CFE3C1" stroke="#9ECA86" strokeWidth="1" />
      <path d="M 88 28 L 96 16 L 104 28 L 96 40 Z" fill="#DCD6FF" stroke="#B8AEFF" strokeWidth="1" />

      <circle cx="30" cy="28" r="2" fill="#887BB0" />
      <circle cx="52" cy="28" r="2" fill="#D9825B" />
      <circle cx="74" cy="28" r="2" fill="#6B9955" />
      <circle cx="96" cy="28" r="2" fill="#887BB0" />
    </svg>
  );
}

export function FireplaceIllustration({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="74" rx="34" ry="6" fill="rgba(52, 52, 71, 0.15)" />
      <rect x="14" y="16" width="52" height="56" rx="5" fill="#E6DAC8" stroke="#C8B8A2" strokeWidth="2" />
      <rect x="10" y="12" width="60" height="7" rx="3" fill="#B38052" />
      <rect x="12" y="13" width="56" height="3" rx="1" fill="#D7A97B" />
      <rect x="22" y="6" width="6" height="7" rx="1" fill="#FFFDF8" />
      <ellipse cx="25" cy="4" rx="2" ry="3" fill="#FFB74D" />
      <rect x="52" y="7" width="7" height="6" rx="2" fill="#FFCCAD" />
      <circle cx="55.5" cy="5" r="3" fill="#7DD4A0" />
      <path d="M 24 72 L 24 38 C 24 28 56 28 56 38 L 56 72 Z" fill="#343447" />
      <ellipse cx="34" cy="67" rx="9" ry="4" fill="#8D5B28" />
      <ellipse cx="46" cy="67" rx="9" ry="4" fill="#8D5B28" />
      <ellipse cx="40" cy="63" rx="8" ry="3.5" fill="#B38052" />
      <path
        d="M 40 46 C 45 52 48 58 46 63 C 44 65 36 65 34 63 C 32 58 35 52 40 46 Z"
        fill="#FF7043"
        className="animate-pulse"
      />
      <path
        d="M 40 50 C 43 54 45 58 44 61 C 42 63 38 63 36 61 C 35 58 37 54 40 50 Z"
        fill="#FFD54F"
      />
    </svg>
  );
}

export function NightstandIllustration({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 60 65" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="58" rx="22" ry="5" fill="rgba(52, 52, 71, 0.12)" />
      <rect x="14" y="44" width="4" height="15" rx="1.5" fill="#8D5B28" />
      <rect x="42" y="44" width="4" height="15" rx="1.5" fill="#8D5B28" />
      <rect x="12" y="20" width="36" height="28" rx="4" fill="#D7A97B" stroke="#B38052" strokeWidth="1.5" />
      <rect x="16" y="24" width="28" height="9" rx="2" fill="#E2BB93" stroke="#B38052" strokeWidth="1" />
      <circle cx="30" cy="28.5" r="2" fill="#FFD54F" />
      <rect x="16" y="36" width="28" height="9" rx="2" fill="#C49363" />
      <rect x="20" y="39" width="12" height="4" rx="1" fill="#DCD6FF" />
      <rect x="10" y="17" width="40" height="5" rx="2" fill="#B38052" />
      <rect x="24" y="9" width="8" height="9" rx="2" fill="#FFCCAD" />
      <path d="M 32 11 Q 36 13 32 16" stroke="#FFCCAD" strokeWidth="1.5" fill="none" />
      <path d="M 26 6 Q 28 3 26 1" stroke="#E6DAC8" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <path d="M 30 7 Q 32 4 30 2" stroke="#E6DAC8" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function GramophoneIllustration({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 70 75" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="35" cy="68" rx="24" ry="5" fill="rgba(52, 52, 71, 0.12)" />
      <rect x="18" y="44" width="34" height="22" rx="4" fill="#8D5B28" stroke="#6D431B" strokeWidth="1.5" />
      <rect x="22" y="48" width="26" height="14" rx="2" fill="#B38052" />
      <circle cx="48" cy="55" r="2.5" fill="#FFD54F" />
      <ellipse cx="35" cy="43" rx="15" ry="4" fill="#2B2B36" />
      <ellipse cx="35" cy="43" rx="6" ry="1.8" fill="#FFCCAD" />
      <path d="M 45 42 L 40 37 L 36 42" stroke="#FFD54F" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M 28 37 C 28 26 16 18 10 10 C 26 6 42 14 42 28 Z"
        fill="#FFD54F"
        stroke="#FFA000"
        strokeWidth="1.5"
      />
      <ellipse cx="10" cy="10" rx="9" ry="14" fill="#FFE082" stroke="#FFA000" strokeWidth="1.5" transform="rotate(30 10 10)" />
      <ellipse cx="10" cy="10" rx="4" ry="7" fill="#E65100" opacity="0.6" transform="rotate(30 10 10)" />
      <text x="50" y="24" fontSize="14" fill="#B8AEFF">🎵</text>
    </svg>
  );
}

export function BeanbagIllustration({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 85 70" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="42.5" cy="62" rx="36" ry="7" fill="rgba(52, 52, 71, 0.12)" />
      <path
        d="M 42.5 12 C 55 12 74 34 74 52 C 74 64 58 64 42.5 64 C 27 64 11 64 11 52 C 11 34 30 12 42.5 12 Z"
        fill="#DCD6FF"
        stroke="#B8AEFF"
        strokeWidth="2"
      />
      <ellipse cx="42.5" cy="46" rx="22" ry="12" fill="#E8E4FF" />
      <path d="M 42.5 12 Q 46 36 42.5 58" stroke="#CEC7FA" strokeWidth="1.8" strokeDasharray="3 2" />
      <path d="M 42.5 12 Q 26 34 16 48" stroke="#CEC7FA" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M 42.5 12 Q 59 34 69 48" stroke="#CEC7FA" strokeWidth="1.5" strokeDasharray="3 2" />
      <ellipse cx="42.5" cy="10" rx="4" ry="2.5" fill="none" stroke="#B8AEFF" strokeWidth="2" />
    </svg>
  );
}

export function TepeeTentIllustration({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 85 85" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="42.5" cy="76" rx="35" ry="6" fill="rgba(52, 52, 71, 0.12)" />
      <line x1="22" y1="8" x2="62" y2="78" stroke="#B38052" strokeWidth="3" strokeLinecap="round" />
      <line x1="62" y1="8" x2="22" y2="78" stroke="#B38052" strokeWidth="3" strokeLinecap="round" />
      <line x1="42.5" y1="6" x2="42.5" y2="78" stroke="#D7A97B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="42.5" cy="16" r="3.5" fill="#E2BB93" stroke="#8D5B28" strokeWidth="1.5" />

      <polygon points="42.5,18 14,75 71,75" fill="#FFF8EE" stroke="#E2BB93" strokeWidth="1.5" />
      <polygon points="42.5,24 30,75 42.5,75" fill="#343447" />
      <polygon points="42.5,24 42.5,75 55,75" fill="#343447" />
      <ellipse cx="42.5" cy="73" rx="11" ry="3.5" fill="#FFCCAD" />
      <polygon points="42.5,24 14,75 28,75" fill="#F0E8D9" />
      <polygon points="42.5,24 57,75 71,75" fill="#F0E8D9" />
      <circle cx="32" cy="38" r="2.5" fill="#FFD54F" className="animate-pulse" />
      <circle cx="53" cy="38" r="2.5" fill="#FFD54F" className="animate-pulse" />
      <circle cx="24" cy="56" r="2.5" fill="#FFD54F" className="animate-pulse" />
      <circle cx="61" cy="56" r="2.5" fill="#FFD54F" className="animate-pulse" />
      <path d="M 44 6 Q 48 2 46 0 Q 42 4 44 6" fill="#DCD6FF" stroke="#B8AEFF" strokeWidth="0.8" />
    </svg>
  );
}

export function TelescopeIllustration({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 70 80" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Floor Shadow */}
      <ellipse cx="35" cy="74" rx="24" ry="5" fill="rgba(52, 52, 71, 0.12)" />
      {/* Wooden Tripod Legs */}
      <line x1="35" y1="42" x2="16" y2="73" stroke="#8D5B28" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="42" x2="35" y2="73" stroke="#B38052" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="42" x2="54" y2="73" stroke="#8D5B28" strokeWidth="3" strokeLinecap="round" />
      {/* Leg Metal Brackets & Spreader */}
      <line x1="25" y1="58" x2="45" y2="58" stroke="#D7A97B" strokeWidth="1.5" />
      {/* Brass Tripod Mount & Axis */}
      <circle cx="35" cy="42" r="5" fill="#D7A97B" stroke="#B38052" strokeWidth="1" />
      {/* Optical Main Tube (Tilted 35 deg up towards the sky) */}
      <g transform="rotate(-32 35 38)">
        {/* Eyepiece */}
        <rect x="10" y="35" width="8" height="6" rx="1.5" fill="#343447" />
        <rect x="18" y="36.5" width="6" height="3" fill="#D7A97B" />
        {/* Main Polished Brass Barrel */}
        <path d="M 24 33 L 56 31 L 56 45 L 24 43 Z" fill="#FFD54F" stroke="#E6B800" strokeWidth="1" />
        <path d="M 25 35 L 55 33 L 55 37 L 25 39 Z" fill="#FFE082" />
        {/* Objective Lens Hood */}
        <rect x="56" y="29" width="8" height="18" rx="2" fill="#D7A97B" stroke="#B38052" strokeWidth="1" />
        <ellipse cx="64" cy="38" rx="2" ry="8" fill="#81D4FA" />
        {/* Star highlight sparkle */}
        <circle cx="60" cy="33" r="1.5" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

export function WindChimesIllustration({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 60 85" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top Hanging Ring & Strings */}
      <circle cx="30" cy="8" r="4" stroke="#B38052" strokeWidth="1.5" />
      <line x1="30" y1="12" x2="30" y2="20" stroke="#C4A882" strokeWidth="1.2" />
      {/* Top Wooden Round Disk */}
      <ellipse cx="30" cy="22" rx="18" ry="4.5" fill="#D7A97B" stroke="#B38052" strokeWidth="1" />
      {/* Metal / Bamboo Chime Tubes */}
      <line x1="18" y1="26" x2="18" y2="56" stroke="#90A4AE" strokeWidth="3" strokeLinecap="round" />
      <line x1="24" y1="26" x2="24" y2="66" stroke="#B0BEC5" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="26" x2="30" y2="48" stroke="#CFD8DC" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="26" x2="36" y2="62" stroke="#B0BEC5" strokeWidth="3" strokeLinecap="round" />
      <line x1="42" y1="26" x2="42" y2="52" stroke="#90A4AE" strokeWidth="3" strokeLinecap="round" />
      {/* Center Clapper */}
      <circle cx="30" cy="46" r="3.5" fill="#B38052" />
      <line x1="30" y1="49" x2="30" y2="68" stroke="#D7A97B" strokeWidth="1" />
      {/* Crystal Prism Wind-Catcher Pendant */}
      <polygon points="30,68 36,75 30,82 24,75" fill="#DCD6FF" stroke="#B8AEFF" strokeWidth="1" className="animate-wiggle" />
      <circle cx="30" cy="75" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

export function FlowerPlanterIllustration({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 90 60" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Floor Shadow */}
      <ellipse cx="45" cy="54" rx="38" ry="4.5" fill="rgba(52, 52, 71, 0.12)" />
      {/* Planter Box Wooden Trough */}
      <rect x="8" y="26" width="74" height="25" rx="3" fill="#E2BB93" stroke="#B38052" strokeWidth="1.5" />
      {/* Wood plank lines */}
      <line x1="8" y1="34" x2="82" y2="34" stroke="#B38052" strokeWidth="1" />
      <line x1="8" y1="42" x2="82" y2="42" stroke="#B38052" strokeWidth="1" />
      {/* Metal Railing Hooks */}
      <rect x="18" y="22" width="4" height="6" rx="1" fill="#8D5B28" />
      <rect x="68" y="22" width="4" height="6" rx="1" fill="#8D5B28" />
      {/* Lush Green Foliage */}
      <ellipse cx="20" cy="22" rx="10" ry="7" fill="#81C784" />
      <ellipse cx="36" cy="20" rx="12" ry="8" fill="#66BB6A" />
      <ellipse cx="54" cy="20" rx="12" ry="8" fill="#81C784" />
      <ellipse cx="70" cy="22" rx="10" ry="7" fill="#66BB6A" />
      {/* Spilling Vines */}
      <path d="M 14 26 Q 10 38 12 46" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
      <path d="M 76 26 Q 80 36 78 44" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
      {/* Blooming Flowers */}
      {/* Pink Blossom */}
      <circle cx="22" cy="18" r="4.5" fill="#FF8A8A" />
      <circle cx="22" cy="18" r="1.5" fill="#FFE082" />
      {/* Daisy */}
      <circle cx="36" cy="14" r="5" fill="#FFFFFF" stroke="#FFF9C4" strokeWidth="0.8" />
      <circle cx="36" cy="14" r="2" fill="#FFD54F" />
      {/* Lavender Petal */}
      <circle cx="50" cy="16" r="4.5" fill="#DCD6FF" />
      <circle cx="50" cy="16" r="1.5" fill="#B8AEFF" />
      {/* Peach Flower */}
      <circle cx="64" cy="15" r="4.5" fill="#FFAB91" />
      <circle cx="64" cy="15" r="1.5" fill="#FFE082" />
    </svg>
  );
}

export function BistroSetIllustration({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 90 75" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadows */}
      <ellipse cx="45" cy="70" rx="14" ry="3.5" fill="rgba(52, 52, 71, 0.12)" />
      <ellipse cx="18" cy="68" rx="10" ry="3" fill="rgba(52, 52, 71, 0.1)" />
      <ellipse cx="72" cy="68" rx="10" ry="3" fill="rgba(52, 52, 71, 0.1)" />

      {/* ─── Center Bistro Table ─── */}
      {/* Curved Iron Pedestal Legs */}
      <path d="M 45 42 L 35 69 M 45 42 L 55 69 M 45 42 L 45 69" stroke="#455A64" strokeWidth="2" strokeLinecap="round" />
      <line x1="33" y1="62" x2="57" y2="62" stroke="#455A64" strokeWidth="1.5" />
      {/* Glass / Iron Tabletop */}
      <ellipse cx="45" cy="38" rx="20" ry="6" fill="#ECEFF1" stroke="#455A64" strokeWidth="2" />
      <ellipse cx="45" cy="38" rx="17" ry="4.5" fill="#CFD8DC" opacity="0.6" />
      {/* Tea Cup & Saucer with Steam */}
      <ellipse cx="45" cy="36" rx="4" ry="1.5" fill="#FFFDF8" stroke="#B38052" strokeWidth="0.8" />
      <rect x="42.5" y="32" width="5" height="4" rx="1" fill="#FFFDF8" stroke="#B38052" strokeWidth="0.8" />
      <path d="M 45 30 Q 44 26 46 24" stroke="#B0BEC5" strokeWidth="1" strokeLinecap="round" className="animate-pulse" />

      {/* ─── Left Bistro Chair ─── */}
      <ellipse cx="18" cy="46" rx="9" ry="3" fill="#B0BEC5" stroke="#455A64" strokeWidth="1.5" />
      <line x1="13" y1="46" x2="11" y2="67" stroke="#455A64" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="23" y1="46" x2="25" y2="67" stroke="#455A64" strokeWidth="1.8" strokeLinecap="round" />
      {/* Heart-scroll Backrest */}
      <path d="M 12 46 C 10 26 26 26 24 46" stroke="#455A64" strokeWidth="1.8" fill="none" />
      <path d="M 14 36 Q 18 30 22 36" stroke="#455A64" strokeWidth="1.2" fill="none" />

      {/* ─── Right Bistro Chair ─── */}
      <ellipse cx="72" cy="46" rx="9" ry="3" fill="#B0BEC5" stroke="#455A64" strokeWidth="1.5" />
      <line x1="67" y1="46" x2="65" y2="67" stroke="#455A64" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="77" y1="46" x2="79" y2="67" stroke="#455A64" strokeWidth="1.8" strokeLinecap="round" />
      {/* Heart-scroll Backrest */}
      <path d="M 66 46 C 64 26 80 26 78 46" stroke="#455A64" strokeWidth="1.8" fill="none" />
      <path d="M 68 36 Q 72 30 76 36" stroke="#455A64" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

export function FairyLightsIllustration({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 110 35" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Draping Wire */}
      <path d="M 4 8 Q 28 20 55 12 Q 82 20 106 8" stroke="#455A64" strokeWidth="1.5" fill="none" />
      {/* Glowing Warm Bulbs */}
      <g transform="translate(18, 14)">
        <circle cx="0" cy="0" r="7" fill="rgba(255, 238, 88, 0.35)" className="animate-pulse" />
        <ellipse cx="0" cy="1" rx="3.5" ry="5" fill="#FFEE58" stroke="#FBC02D" strokeWidth="0.8" />
        <rect x="-1.5" y="-3" width="3" height="2" fill="#78909C" />
      </g>
      <g transform="translate(36, 15)">
        <circle cx="0" cy="0" r="7" fill="rgba(255, 171, 145, 0.35)" className="animate-pulse" />
        <ellipse cx="0" cy="1" rx="3.5" ry="5" fill="#FFAB91" stroke="#E64A19" strokeWidth="0.8" />
        <rect x="-1.5" y="-3" width="3" height="2" fill="#78909C" />
      </g>
      <g transform="translate(55, 12)">
        <circle cx="0" cy="0" r="7" fill="rgba(255, 238, 88, 0.35)" className="animate-pulse" />
        <ellipse cx="0" cy="1" rx="3.5" ry="5" fill="#FFEE58" stroke="#FBC02D" strokeWidth="0.8" />
        <rect x="-1.5" y="-3" width="3" height="2" fill="#78909C" />
      </g>
      <g transform="translate(74, 15)">
        <circle cx="0" cy="0" r="7" fill="rgba(220, 214, 255, 0.35)" className="animate-pulse" />
        <ellipse cx="0" cy="1" rx="3.5" ry="5" fill="#DCD6FF" stroke="#7E57C2" strokeWidth="0.8" />
        <rect x="-1.5" y="-3" width="3" height="2" fill="#78909C" />
      </g>
      <g transform="translate(92, 14)">
        <circle cx="0" cy="0" r="7" fill="rgba(255, 238, 88, 0.35)" className="animate-pulse" />
        <ellipse cx="0" cy="1" rx="3.5" ry="5" fill="#FFEE58" stroke="#FBC02D" strokeWidth="0.8" />
        <rect x="-1.5" y="-3" width="3" height="2" fill="#78909C" />
      </g>
    </svg>
  );
}

export function CatTreeIllustration({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 75 85" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="37.5" cy="78" rx="28" ry="5.5" fill="rgba(52, 52, 71, 0.12)" />
      <rect x="14" y="72" width="47" height="6" rx="3" fill="#D7A97B" stroke="#B38052" strokeWidth="1" />
      <rect x="22" y="32" width="7" height="42" rx="2" fill="#E2BB93" stroke="#C49363" strokeWidth="1" />
      <line x1="22" y1="40" x2="29" y2="40" stroke="#C49363" strokeWidth="1" />
      <line x1="22" y1="48" x2="29" y2="48" stroke="#C49363" strokeWidth="1" />
      <line x1="22" y1="56" x2="29" y2="56" stroke="#C49363" strokeWidth="1" />
      <line x1="22" y1="64" x2="29" y2="64" stroke="#C49363" strokeWidth="1" />
      <rect x="46" y="46" width="7" height="28" rx="2" fill="#E2BB93" stroke="#C49363" strokeWidth="1" />
      <line x1="46" y1="54" x2="53" y2="54" stroke="#C49363" strokeWidth="1" />
      <line x1="46" y1="62" x2="53" y2="62" stroke="#C49363" strokeWidth="1" />
      <rect x="38" y="42" width="24" height="5" rx="2.5" fill="#CFE3C1" stroke="#A8CC8F" strokeWidth="1" />
      <rect x="14" y="28" width="25" height="5" rx="2.5" fill="#DCD6FF" stroke="#B8AEFF" strokeWidth="1" />
      <ellipse cx="26.5" cy="27" rx="11" ry="3.5" fill="#E8E4FF" />
      <line x1="20" y1="33" x2="20" y2="45" stroke="#8D5B28" strokeWidth="1" />
      <circle cx="20" cy="46" r="3" fill="#FF8A8A" className="animate-bounce" />
    </svg>
  );
}

/**
 * Universal Item Renderer:
 * Dispatches to the corresponding rich SVG illustration based on assetKey or itemId.
 */
export function FurnitureIllustration({ assetKey, itemId, className = 'w-16 h-16', style = {} }) {
  const key = assetKey || itemId;

  switch (key) {
    case 'bed':
    case 'small-wooden-bed':
      return <BedIllustration className={className} style={style} />;
    case 'sofa':
    case 'pastel-sofa':
      return <SofaIllustration className={className} style={style} />;
    case 'desk':
    case 'desk-and-chair':
      return <DeskIllustration className={className} style={style} />;
    case 'bookshelf':
      return <BookshelfIllustration className={className} style={style} />;
    case 'armchair':
    case 'cozy-armchair':
      return <ArmchairIllustration className={className} style={style} />;
    case 'fireplace':
    case 'cozy-fireplace':
      return <FireplaceIllustration className={className} style={style} />;
    case 'nightstand':
    case 'wooden-nightstand':
      return <NightstandIllustration className={className} style={style} />;
    case 'gramophone':
    case 'vintage-gramophone':
      return <GramophoneIllustration className={className} style={style} />;
    case 'beanbag':
    case 'beanbag-cushion':
      return <BeanbagIllustration className={className} style={style} />;
    case 'tepee-tent':
    case 'pet-tepee-tent':
      return <TepeeTentIllustration className={className} style={style} />;
    case 'cat-tree':
    case 'cat-tree-tower':
      return <CatTreeIllustration className={className} style={style} />;
    case 'potted-plant':
      return <PottedPlantIllustration className={className} style={style} />;
    case 'hanging-ivy':
      return <HangingIvyIllustration className={className} style={style} />;
    case 'succulents':
    case 'succulent-trio':
      return <SucculentsIllustration className={className} style={style} />;
    case 'rug':
    case 'round-rug':
      return <RugIllustration className={className} style={style} />;
    case 'cloud-rug':
    case 'cloud-fluffy-rug':
      return <CloudRugIllustration className={className} style={style} />;
    case 'daisy-rug':
    case 'daisy-flower-rug':
      return <DaisyRugIllustration className={className} style={style} />;
    case 'paw-rug':
    case 'cat-paw-rug':
      return <CatPawRugIllustration className={className} style={style} />;
    case 'boho-runner':
    case 'boho-woven-runner':
      return <BohoRunnerIllustration className={className} style={style} />;
    case 'star-lamp':
      return <StarLampIllustration className={className} style={style} />;
    case 'curtains':
    case 'window-curtains':
      return <CurtainsIllustration className={className} style={style} />;
    case 'photo-frame':
      return <PhotoFrameIllustration className={className} style={style} />;
    case 'telescope':
    case 'brass-telescope':
      return <TelescopeIllustration className={className} style={style} />;
    case 'wind-chimes':
      return <WindChimesIllustration className={className} style={style} />;
    case 'flower-planter':
    case 'flower-planter-box':
      return <FlowerPlanterIllustration className={className} style={style} />;
    case 'bistro-set':
    case 'bistro-table-chairs':
      return <BistroSetIllustration className={className} style={style} />;
    case 'fairy-lights':
      return <FairyLightsIllustration className={className} style={style} />;
    default:
      return (
        <div
          className={`flex items-center justify-center bg-lavender/30 rounded-xl text-2xl ${className}`}
          style={style}
        >
          📦
        </div>
      );
  }
}
