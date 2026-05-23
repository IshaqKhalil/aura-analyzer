import { AURA_TYPES } from '../config/auraTypes.js';

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function weightedSelect(items, rng) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = rng() * totalWeight;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

function pickRandom(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

export function generateAura(seed = null) {
  const effectiveSeed = seed ?? (Date.now() ^ Math.floor(Math.random() * 0xffffff));
  const rng = seededRandom(effectiveSeed);

  const auraType = weightedSelect(AURA_TYPES, rng);

  // Score weighted toward 65–95
  const scoreBase = 55 + Math.floor(rng() * 40);
  const rarityBonus = { LEGENDARY: 8, EPIC: 5, RARE: 3, UNCOMMON: 1, COMMON: 0 };
  const score = Math.min(100, scoreBase + (rarityBonus[auraType.rarity] ?? 0));

  // Confidence breakdown (fake percentages that add drama)
  const confidenceValues = generateConfidences(rng);

  // Pick 3 funny observations
  const shuffledObs = [...auraType.funnyObservations].sort(() => rng() - 0.5);
  const selectedObservations = shuffledObs.slice(0, 3);

  // Randomize stat values slightly within range
  const stats = {};
  for (const [key, val] of Object.entries(auraType.stats)) {
    const variance = Math.floor((rng() - 0.5) * 12);
    stats[key] = Math.max(10, Math.min(100, val + variance));
  }

  // Rarity badge modifier
  const isRare = ['LEGENDARY', 'EPIC'].includes(auraType.rarity);
  const superRare = auraType.rarity === 'LEGENDARY';

  return {
    id: auraType.id,
    name: auraType.name,
    emoji: auraType.emoji,
    rarity: auraType.rarity,
    score,
    colors: auraType.colors,
    gradient: auraType.gradient,
    bgGradient: auraType.bgGradient,
    description: auraType.description,
    shortDesc: auraType.shortDesc,
    traits: auraType.traits,
    hiddenPower: auraType.hiddenPower,
    redFlag: auraType.redFlag,
    greenFlag: auraType.greenFlag,
    animeEnergy: auraType.animeEnergy,
    auraAnimal: auraType.auraAnimal,
    vibeColor: auraType.vibeColor,
    compatibility: auraType.compatibility,
    secretThoughts: auraType.secretThoughts,
    moodAnalysis: auraType.moodAnalysis,
    socialVibe: auraType.socialVibe,
    energyLevel: auraType.energyLevel,
    stats,
    funnyObservations: selectedObservations,
    confidences: confidenceValues,
    isRare,
    superRare,
    seed: effectiveSeed,
    timestamp: Date.now(),
  };
}

function generateConfidences(rng) {
  const base = 80 + Math.floor(rng() * 18);
  return {
    personality: base,
    energy: Math.min(100, base + Math.floor(rng() * 8) - 4),
    vibeFrequency: Math.min(100, base + Math.floor(rng() * 10) - 5),
    chaosIndex: Math.floor(20 + rng() * 70),
    soulDepth: Math.min(100, base + Math.floor(rng() * 12) - 6),
  };
}

export const EXAMPLE_AURAS = [
  { name: 'Cosmic Aura', emoji: '🌌', score: 94, rarity: 'LEGENDARY', color: '#8b5cf6', user: 'Alex K.' },
  { name: 'Golden Aura', emoji: '🌟', score: 91, rarity: 'LEGENDARY', color: '#f59e0b', user: 'Maya R.' },
  { name: 'Villain Arc', emoji: '🖤', score: 88, rarity: 'EPIC', color: '#7c3aed', user: 'Jordan T.' },
  { name: 'Phoenix Aura', emoji: '🔥', score: 86, rarity: 'EPIC', color: '#ef4444', user: 'Sam L.' },
  { name: 'Angel Aura', emoji: '👼', score: 82, rarity: 'RARE', color: '#e0f2fe', user: 'Chris M.' },
  { name: 'Chaos Aura', emoji: '🌪️', score: 79, rarity: 'UNCOMMON', color: '#f97316', user: 'Taylor W.' },
];
