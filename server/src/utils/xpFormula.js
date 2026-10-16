/**
 * XP ↔ Level conversion utilities.
 *
 * Formula: XP required for level N = N * (N - 1) * 50
 *   Level 1 →     0 XP
 *   Level 2 →   100 XP
 *   Level 3 →   300 XP
 *   Level 5 →  1000 XP
 *   Level 10 → 4500 XP
 */

/**
 * Calculate the user's level from their total XP.
 */
function getLevelFromXP(totalXP) {
  if (totalXP <= 0) return 1;
  // Solve N*(N-1)*50 = totalXP → quadratic: N² - N - totalXP/50 = 0
  const level = Math.floor(0.5 + Math.sqrt(0.25 + totalXP / 50));
  return Math.max(1, level);
}

/**
 * Get cumulative XP required to reach a given level.
 */
function getXPForLevel(level) {
  if (level <= 1) return 0;
  return level * (level - 1) * 50;
}

/**
 * Get XP progress within the current level.
 */
function getLevelProgress(totalXP) {
  const currentLevel = getLevelFromXP(totalXP);
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  const xpInLevel = totalXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;

  return {
    level: currentLevel,
    currentXP: xpInLevel,
    requiredXP: xpNeeded,
    totalXP,
    progress: xpNeeded > 0 ? Math.min(xpInLevel / xpNeeded, 1) : 1,
  };
}

module.exports = { getLevelFromXP, getXPForLevel, getLevelProgress };
