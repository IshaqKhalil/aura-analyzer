import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { FiRefreshCw, FiShare2, FiHome, FiDownload, FiZap } from 'react-icons/fi';
import {
  HiSparkles, HiLightningBolt, HiHeart, HiEye, HiStar,
  HiShieldCheck, HiExclamationCircle, HiColorSwatch, HiGlobe
} from 'react-icons/hi';

// Animated score counter
function AnimatedScore({ target }) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = rounded.on('change', setDisplay);
    const ctrl = animate(motionVal, target, { duration: 2, ease: 'easeOut' });
    return () => { unsub(); ctrl.stop(); };
  }, [target, motionVal, rounded]);

  return <span>{display}</span>;
}

// SVG circle progress
function ScoreCircle({ score, colors }) {
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-52 h-52 mx-auto">
      <svg className="absolute inset-0 -rotate-90" width="208" height="208" viewBox="0 0 208 208">
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle cx="104" cy="104" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        {/* Progress */}
        <motion.circle
          cx="104" cy="104" r={radius}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
          filter="url(#glow)"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-black text-white leading-none">
          <AnimatedScore target={score} />
        </div>
        <div className="text-xs text-white/40 font-medium tracking-wider uppercase mt-1">Aura Score</div>
      </div>
    </div>
  );
}

function RarityBadge({ rarity }) {
  const classes = {
    LEGENDARY: 'badge-legendary',
    EPIC: 'badge-epic',
    RARE: 'badge-rare',
    UNCOMMON: 'badge-uncommon',
    COMMON: 'badge-common',
  };
  const labels = {
    LEGENDARY: '⭐ LEGENDARY',
    EPIC: '💜 EPIC',
    RARE: '💎 RARE',
    UNCOMMON: '✦ UNCOMMON',
    COMMON: '· COMMON',
  };
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest ${classes[rarity] || classes.COMMON}`}>
      {labels[rarity] || rarity}
    </span>
  );
}

function StatBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-white/50 capitalize">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.8 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass rounded-2xl p-4 trait-card"
      style={{ borderColor: `${color}22` }}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <div className="min-w-0">
          <div className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-1">{label}</div>
          <div className="text-sm text-white/90 leading-snug font-medium">{value}</div>
        </div>
      </div>
    </motion.div>
  );
}

function TraitChip({ trait, color, delay }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="text-xs px-3 py-1.5 rounded-full font-medium"
      style={{
        background: `${color}18`,
        border: `1px solid ${color}40`,
        color: color,
      }}
    >
      {trait}
    </motion.span>
  );
}

function ObservationCard({ observation, index, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2 + index * 0.12 }}
      className="flex items-start gap-3 glass rounded-xl p-3"
    >
      <span className="text-sm flex-shrink-0" style={{ color }}>{'→'}</span>
      <p className="text-sm text-white/70 leading-relaxed">{observation}</p>
    </motion.div>
  );
}

export default function ResultsScreen({ result, onRetry, onHome }) {
  const [shareMsg, setShareMsg] = useState(null);
  const resultRef = useRef(null);

  const handleShare = useCallback(async () => {
    const text = `I just discovered my aura! I have a ${result.name} (Score: ${result.score}/100) ${result.emoji}\n\n${result.shortDesc}\n\nDiscover yours → AuraAnalyzer.app`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Aura Result ✨', text });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setShareMsg('Copied to clipboard!');
        setTimeout(() => setShareMsg(null), 2500);
      } catch {
        setShareMsg('Could not copy — try manually!');
        setTimeout(() => setShareMsg(null), 2500);
      }
    }
  }, [result]);

  const stats = Object.entries(result.stats);
  const statColors = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#ef4444', '#10b981'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen overflow-x-hidden pb-24"
    >
      {/* Dynamic background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% -20%, rgba(0,0,0,0) 0%, #050508 70%)' }} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 opacity-20"
          style={{ background: result.bgGradient }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-0">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onHome}
          className="glass rounded-xl p-2.5 text-white/60 hover:text-white transition-colors"
        >
          <FiHome className="w-5 h-5" />
        </motion.button>
        <div className="flex items-center gap-1.5">
          <HiSparkles className="text-purple-400 w-4 h-4" />
          <span className="text-xs text-white/50 font-medium">Aura Revealed</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleShare}
          className="glass rounded-xl p-2.5 text-white/60 hover:text-white transition-colors"
        >
          <FiShare2 className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Share feedback */}
      <AnimatePresence>
        {shareMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-16 left-0 right-0 flex justify-center z-50 pointer-events-none"
          >
            <div className="glass-strong rounded-full px-4 py-2 text-sm text-white font-medium">
              ✓ {shareMsg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={resultRef} className="relative z-10 max-w-xl mx-auto px-4 pt-6">

        {/* Rarity + rare badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-4 gap-2 flex-wrap"
        >
          <RarityBadge rarity={result.rarity} />
          {result.superRare && (
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(239,68,68,0.3))',
                border: '1px solid rgba(245,158,11,0.6)',
                color: '#fbbf24',
              }}
            >
              🔥 TOP 5% RAREST
            </motion.span>
          )}
        </motion.div>

        {/* Aura name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="text-center mb-2"
        >
          <span className="text-3xl mr-2">{result.emoji}</span>
          <h1
            className="text-4xl sm:text-5xl font-black tracking-tight inline"
            style={{
              background: result.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {result.name}
          </h1>
        </motion.div>

        {/* Short desc */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-white/50 text-sm mb-6 px-4"
        >
          {result.shortDesc}
        </motion.p>

        {/* Score circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
          className="mb-6"
        >
          <ScoreCircle score={result.score} colors={result.colors} />
        </motion.div>

        {/* Confidence row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-4 mb-8 flex-wrap"
        >
          {Object.entries(result.confidences).map(([key, val]) => (
            <div key={key} className="text-center">
              <div className="text-lg font-black" style={{ color: result.colors.primary }}>{val}%</div>
              <div className="text-[10px] text-white/40 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
            </div>
          ))}
        </motion.div>

        {/* Full description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-5 mb-5"
          style={{ borderColor: `${result.colors.primary}33` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <HiEye style={{ color: result.colors.primary }} className="w-4 h-4" />
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Aura Reading</span>
          </div>
          <p className="text-sm text-white/80 leading-relaxed">{result.description}</p>
        </motion.div>

        {/* Personality traits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-5"
        >
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Your Traits</h3>
          <div className="flex flex-wrap gap-2">
            {result.traits.map((trait, i) => (
              <TraitChip key={trait} trait={trait} color={result.colors.primary} delay={0.8 + i * 0.08} />
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="glass rounded-2xl p-5 mb-5"
          style={{ borderColor: `${result.colors.secondary}22` }}
        >
          <div className="flex items-center gap-2 mb-4">
            <HiLightningBolt style={{ color: result.colors.secondary }} className="w-4 h-4" />
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Energy Matrix</span>
          </div>
          <div className="space-y-3">
            {stats.map(([key, val], i) => (
              <StatBar key={key} label={key} value={val} color={statColors[i % statColors.length]} />
            ))}
          </div>
        </motion.div>

        {/* Info cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <InfoCard icon={<HiStar />} label="Hidden Power" value={result.hiddenPower} color={result.colors.primary} delay={1.0} />
          <InfoCard icon={<HiExclamationCircle />} label="Red Flag 🚩" value={result.redFlag} color="#ef4444" delay={1.05} />
          <InfoCard icon={<HiShieldCheck />} label="Green Flag 🌿" value={result.greenFlag} color="#10b981" delay={1.1} />
          <InfoCard icon={<HiHeart />} label="Vibe Match" value={result.compatibility} color={result.colors.secondary} delay={1.15} />
          <InfoCard icon={<HiColorSwatch />} label="Anime Energy" value={result.animeEnergy} color="#a855f7" delay={1.2} />
          <InfoCard icon={<HiGlobe />} label="Aura Animal" value={result.auraAnimal} color="#f59e0b" delay={1.25} />
        </div>

        {/* Mood & vibe row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="grid grid-cols-2 gap-3 mb-5"
        >
          {[
            { label: 'Mood Analysis', value: result.moodAnalysis, icon: '🎭' },
            { label: 'Social Vibe', value: result.socialVibe, icon: '🌀' },
            { label: 'Vibe Color', value: result.vibeColor, icon: '🎨' },
            { label: 'Energy Level', value: `${result.energyLevel}/100`, icon: '⚡' },
          ].map((item, i) => (
            <div key={item.label} className="glass rounded-2xl p-3.5 text-center trait-card"
              style={{ borderColor: `${result.colors.accent}33` }}>
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{item.label}</div>
              <div className="text-xs font-semibold text-white/80">{item.value}</div>
            </div>
          ))}
        </motion.div>

        {/* Secret thoughts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05 }}
          className="glass rounded-2xl p-4 mb-5 relative overflow-hidden"
          style={{ borderColor: `${result.colors.primary}33` }}
        >
          <div className="absolute inset-0 opacity-5"
            style={{ background: `linear-gradient(135deg, ${result.colors.primary}, ${result.colors.secondary})` }} />
          <div className="relative flex items-start gap-3">
            <span className="text-lg flex-shrink-0">🤫</span>
            <div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5">What People Secretly Think About You</div>
              <p className="text-sm text-white/80 font-medium leading-relaxed italic">"{result.secretThoughts}"</p>
            </div>
          </div>
        </motion.div>

        {/* Funny observations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15 }}
          className="mb-8"
        >
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
            🔬 AI Observations
          </h3>
          <div className="space-y-2">
            {result.funnyObservations.map((obs, i) => (
              <ObservationCard key={i} observation={obs} index={i} color={result.colors.primary} />
            ))}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="flex flex-col gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            className="shimmer-btn w-full flex items-center justify-center gap-2.5 font-bold text-white py-4 rounded-2xl"
            style={{
              background: result.gradient,
              boxShadow: `0 0 30px ${result.colors.glow}, 0 4px 24px rgba(0,0,0,0.4)`,
            }}
          >
            <FiShare2 className="w-5 h-5" />
            Share My Aura
          </motion.button>

          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRetry}
              className="flex items-center justify-center gap-2 glass rounded-2xl py-3.5 text-white/70 font-medium text-sm hover:text-white transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" /> Scan Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onHome}
              className="flex items-center justify-center gap-2 glass rounded-2xl py-3.5 text-white/70 font-medium text-sm hover:text-white transition-colors"
            >
              <FiHome className="w-4 h-4" /> Home
            </motion.button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center text-white/20 text-[11px] mt-8 pb-4"
        >
          Aura Analyzer · For entertainment purposes · Results may be devastatingly accurate ✨
        </motion.p>
      </div>
    </motion.div>
  );
}

