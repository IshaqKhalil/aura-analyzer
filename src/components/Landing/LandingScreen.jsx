import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiCamera, FiZap, FiStar, FiUsers, FiTrendingUp, FiShare2 } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { EXAMPLE_AURAS } from '../../utils/auraGenerator.js';

const SUBTITLES = [
  'Your face holds secrets the universe planted there.',
  'Every aura is unique. Most are extraordinary.',
  'AI reads what mirrors can\'t show you.',
  'The scan takes seconds. The truth lasts forever.',
  'Over 10 million auras revealed. Yours is next.',
];

const STATS = [
  { icon: <FiUsers />, value: '10M+', label: 'Auras Scanned' },
  { icon: <FiTrendingUp />, value: '#1', label: 'Viral App' },
  { icon: <FiStar />, value: '4.9★', label: 'Rating' },
  { icon: <FiShare2 />, value: '2M+', label: 'Shares' },
];

const RECENT_NAMES = ['@celestial_kai', '@moonchild.era', '@sigma.ascended', '@vibes.unlocked', '@aura.check', '@main.char.only'];

function FloatingAuraCard({ aura, style, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      className="absolute pointer-events-none select-none"
      style={style}
    >
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 2, -1, 0] }}
        transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut' }}
        className="glass rounded-2xl p-3 w-44 shadow-glass"
        style={{ borderColor: aura.color + '44' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{aura.emoji}</span>
          <div>
            <div className="text-xs font-bold text-white leading-tight">{aura.name}</div>
            <div className="text-[10px] text-white/40">{aura.user}</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold" style={{ color: aura.color }}>
            Score: {aura.score}
          </div>
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full badge-${aura.rarity.toLowerCase()}`}>
            {aura.rarity}
          </span>
        </div>
        <div className="mt-1.5 h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${aura.score}%`, background: `linear-gradient(90deg, ${aura.color}, ${aura.color}88)` }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function FeatureChip({ icon, text }) {
  return (
    <div className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5 text-xs text-white/60">
      <span className="text-purple-400">{icon}</span>
      {text}
    </div>
  );
}

export default function LandingScreen({ onStartScan }) {
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [recentIndex, setRecentIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSubtitleIndex((i) => (i + 1) % SUBTITLES.length), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setRecentIndex((i) => (i + 1) % RECENT_NAMES.length), 2000);
    return () => clearInterval(t);
  }, []);

  const cardPositions = [
    { top: '8%', left: '-2%', delay: 0.3 },
    { top: '5%', right: '0%', delay: 0.6 },
    { top: '42%', left: '-3%', delay: 0.9 },
    { top: '60%', right: '-1%', delay: 1.1 },
    { bottom: '12%', left: '2%', delay: 1.3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen flex flex-col items-center overflow-x-hidden"
    >
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb-1 absolute w-[600px] h-[600px] rounded-full opacity-20 blur-5xl"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', top: '-10%', left: '-15%' }} />
        <div className="orb-2 absolute w-[500px] h-[500px] rounded-full opacity-15 blur-5xl"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent)', top: '20%', right: '-10%' }} />
        <div className="orb-3 absolute w-[400px] h-[400px] rounded-full opacity-15 blur-5xl"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', bottom: '10%', left: '30%' }} />
        <div className="orb-4 absolute w-[350px] h-[350px] rounded-full opacity-10 blur-5xl"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)', bottom: '-5%', right: '5%' }} />
      </div>

      {/* Floating cards (hidden on mobile) */}
      <div className="hidden lg:block">
        {EXAMPLE_AURAS.slice(0, 5).map((aura, i) => (
          <FloatingAuraCard key={aura.name} aura={aura} style={cardPositions[i]} delay={cardPositions[i].delay} />
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full flex justify-center py-5 px-4 relative z-10"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
            <HiSparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">Aura Analyzer</span>
          <span className="text-[10px] glass rounded-full px-2 py-0.5 text-purple-300 font-medium ml-1">BETA</span>
        </div>
      </motion.header>

      {/* Hero section */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-6 pb-12 max-w-2xl mx-auto">
        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-white/60">
            <AnimatePresence mode="wait">
              <motion.span
                key={recentIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-purple-300 font-medium"
              >
                {RECENT_NAMES[recentIndex]}
              </motion.span>
            </AnimatePresence>
            {' '}just revealed their aura
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          className="text-5xl sm:text-6xl md:text-7xl font-black leading-none tracking-tight mb-4"
        >
          <span className="block text-white">Discover</span>
          <span className="block text-white">Your</span>
          <span className="gradient-text block">Hidden Aura</span>
        </motion.h1>

        {/* Animated subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="h-8 flex items-center mb-8"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={subtitleIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-sm sm:text-base text-white/50 max-w-sm"
            >
              {SUBTITLES[subtitleIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStartScan}
            className="shimmer-btn relative group flex items-center gap-3 text-white font-bold text-lg px-8 py-4 rounded-2xl cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 40%, #ec4899 80%, #06b6d4 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 4s ease infinite',
              boxShadow: '0 0 30px rgba(139,92,246,0.5), 0 0 60px rgba(236,72,153,0.3), 0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            <FiCamera className="w-5 h-5" />
            <span>Reveal My Aura</span>
            <FiZap className="w-4 h-4 opacity-80" />
          </motion.button>
        </motion.div>

        {/* Feature chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          <FeatureChip icon={<FiZap size={10} />} text="Instant Results" />
          <FeatureChip icon={<FiStar size={10} />} text="AI-Powered" />
          <FeatureChip icon={<FiShare2 size={10} />} text="Share Ready" />
          <FeatureChip icon={<FiCamera size={10} />} text="No Sign Up" />
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-4 gap-3 w-full max-w-sm"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="glass rounded-xl p-2.5 text-center"
            >
              <div className="text-purple-400 flex justify-center mb-1">{stat.icon}</div>
              <div className="text-white font-bold text-sm leading-tight">{stat.value}</div>
              <div className="text-white/40 text-[10px]">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Example aura cards section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.7 }}
        className="relative z-10 w-full max-w-2xl px-6 mb-16"
      >
        <div className="text-center mb-6">
          <span className="text-white/40 text-xs uppercase tracking-widest font-medium">Recent Aura Reveals</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {EXAMPLE_AURAS.map((aura, i) => (
            <motion.div
              key={aura.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.08 }}
              whileHover={{ scale: 1.03, y: -2 }}
              className="glass rounded-2xl p-3.5 cursor-default trait-card"
              style={{ borderColor: aura.color + '33' }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                  style={{ background: aura.color + '22', border: `1px solid ${aura.color}44` }}>
                  {aura.emoji}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white leading-tight">{aura.name}</div>
                  <div className="text-[10px] text-white/40">{aura.user}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold" style={{ color: aura.color }}>{aura.score}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full badge-${aura.rarity.toLowerCase()}`}>
                  {aura.rarity}
                </span>
              </div>
              <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${aura.score}%`, background: aura.color }} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="relative z-10 text-center pb-12 px-6"
      >
        <p className="text-white/30 text-xs mb-4">
          Powered by advanced aura detection algorithms ✨
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStartScan}
          className="text-purple-400 text-sm font-medium flex items-center gap-2 mx-auto hover:text-purple-300 transition-colors"
        >
          <FiCamera className="w-4 h-4" />
          Start your free scan →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
