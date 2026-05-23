import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { FiArrowLeft, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { useCamera } from '../../hooks/useCamera.js';
import { useFaceDetection } from '../../hooks/useFaceDetection.js';
import { generateAura } from '../../utils/auraGenerator.js';

const SCAN_STEPS = [
  { id: 1, label: 'Calibrating sensors…', duration: 1400 },
  { id: 2, label: 'Reading energy field…', duration: 1600 },
  { id: 3, label: 'Detecting personality matrix…', duration: 1800 },
  { id: 4, label: 'Measuring vibe frequency…', duration: 1500 },
  { id: 5, label: 'Analyzing chaos index…', duration: 1600 },
  { id: 6, label: 'Unlocking hidden aura…', duration: 1200 },
];

const TOTAL_DURATION = SCAN_STEPS.reduce((s, st) => s + st.duration, 0) + 1200;

function ScanningRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border border-cyan-500/30"
          style={{
            width: `${55 + i * 15}%`,
            height: `${55 + i * 15}%`,
            animation: `ringExpand ${2 + i * 0.5}s ease-out ${i * 0.4}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function CornerBrackets() {
  return (
    <>
      <div className="scanner-corner scanner-corner-tl" style={{ borderColor: '#06b6d4', width: 28, height: 28 }} />
      <div className="scanner-corner scanner-corner-tr" style={{ borderColor: '#06b6d4', width: 28, height: 28 }} />
      <div className="scanner-corner scanner-corner-bl" style={{ borderColor: '#06b6d4', width: 28, height: 28 }} />
      <div className="scanner-corner scanner-corner-br" style={{ borderColor: '#06b6d4', width: 28, height: 28 }} />
    </>
  );
}

function StepItem({ step, state }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2.5"
    >
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background:
            state === 'done' ? 'rgba(52,211,153,0.2)' :
            state === 'active' ? 'rgba(103,232,249,0.2)' :
            'rgba(255,255,255,0.05)',
          border: `1px solid ${
            state === 'done' ? '#34d399' :
            state === 'active' ? '#67e8f9' :
            'rgba(255,255,255,0.15)'
          }`,
        }}
      >
        {state === 'done' ? (
          <span className="text-green-400 text-[10px]">✓</span>
        ) : state === 'active' ? (
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
        )}
      </div>
      <span className={`text-xs font-medium ${
        state === 'done' ? 'text-green-400' :
        state === 'active' ? 'text-cyan-300' :
        'text-white/30'
      }`}>{step.label}</span>
    </motion.div>
  );
}

export default function ScannerScreen({ onScanComplete, onBack }) {
  const { videoRef, status, error, startCamera, stopCamera } = useCamera();
  const { faceDetected, startDetection, stopDetection } = useFaceDetection(videoRef);

  const [phase, setPhase] = useState('init');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showFlash, setShowFlash] = useState(false);

  // Stable refs for cleanup — never trigger re-renders
  const stopCameraRef = useRef(stopCamera);
  const stopDetectionRef = useRef(stopDetection);
  const onScanCompleteRef = useRef(onScanComplete);
  stopCameraRef.current = stopCamera;
  stopDetectionRef.current = stopDetection;
  onScanCompleteRef.current = onScanComplete;

  // Start camera once on mount
  useEffect(() => {
    startCamera();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Run the scan chain exactly once when camera becomes active.
  // The cleanup `cancelled = true` ensures StrictMode's double-invoke and
  // any mid-scan navigation both kill the chain before the next callback fires.
  useEffect(() => {
    if (status === 'error' || status === 'denied') {
      setPhase('error');
      return;
    }
    if (status !== 'active') return;

    startDetection();
    setPhase('scanning');

    let cancelled = false;
    let stepIdx = 0;
    let timerId = null;

    const finish = () => {
      if (cancelled) return;
      setCurrentStep(null);
      setShowFlash(true);
      timerId = setTimeout(() => {
        if (cancelled) return;
        setShowFlash(false);
        stopDetectionRef.current();
        stopCameraRef.current();
        onScanCompleteRef.current(generateAura());
      }, 700);
    };

    const runStep = () => {
      if (cancelled) return;
      if (stepIdx >= SCAN_STEPS.length) {
        finish();
        return;
      }
      setCurrentStep(stepIdx);
      const step = SCAN_STEPS[stepIdx]; // capture before mutation
      timerId = setTimeout(() => {
        if (cancelled) return;
        // Capture stepIdx value at callback time (still the same value since
        // stepIdx hasn't been mutated yet in this closure call).
        const completedIdx = stepIdx;
        stepIdx += 1;
        setCompletedSteps((prev) => [...prev, completedIdx]);
        runStep();
      }, step.duration);
    };

    // Small delay so the camera renders visibly before scan starts
    timerId = setTimeout(runStep, 1200);

    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
    // startDetection is stable (useCallback with []); status is the real trigger
  }, [status, startDetection]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBack = () => {
    stopDetection();
    stopCamera();
    onBack();
  };

  const handleRetry = () => {
    // Reset visual state fully before re-requesting camera
    setPhase('init');
    setCurrentStep(0);
    setCompletedSteps([]);
    setShowFlash(false);
    startCamera();
  };

  // Defensive: only sum indices that exist in SCAN_STEPS
  const elapsed = completedSteps.reduce(
    (s, i) => s + (SCAN_STEPS[i]?.duration ?? 0),
    0,
  );
  const progress = Math.min(100, Math.round((elapsed / TOTAL_DURATION) * 100));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex flex-col"
    >
      {/* Flash overlay */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.8), rgba(6,182,212,0.4), transparent)' }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 relative z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
          className="glass rounded-xl p-2.5 text-white/60 hover:text-white transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
        </motion.button>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-xs text-white/50 font-medium uppercase tracking-wider">Aura Scan</span>
        </div>
        <div className="w-10 h-10 opacity-0" />
      </div>

      {/* Error state */}
      {phase === 'error' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500/20 border border-red-500/40">
            <FiAlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <div className="text-center">
            <h3 className="text-white font-bold text-lg mb-2">Camera Access Required</h3>
            <p className="text-white/50 text-sm max-w-xs">
              {error || 'Please allow camera access to scan your aura.'}
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRetry}
              className="flex items-center gap-2 glass rounded-xl px-5 py-2.5 text-white text-sm font-medium"
            >
              <FiRefreshCw className="w-4 h-4" /> Try Again
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="glass rounded-xl px-5 py-2.5 text-white/60 text-sm"
            >
              Go Back
            </motion.button>
          </div>
        </div>
      )}

      {/* Camera + scan UI */}
      {phase !== 'error' && (
        <div className="flex-1 relative overflow-hidden">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />

          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)' }}
          />

          {phase === 'scanning' && <div className="absolute inset-0 scan-grid opacity-30" />}
          {phase === 'scanning' && <div className="scan-line" />}
          {phase === 'scanning' && <ScanningRings />}

          {/* Face lock indicator */}
          <AnimatePresence>
            {faceDetected && phase === 'scanning' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute"
                style={{ top: '12%', left: '20%', right: '20%', bottom: '20%' }}
              >
                <div className="absolute inset-0 face-box rounded-lg">
                  <CornerBrackets />
                </div>
                <div className="absolute -top-7 left-0 right-0 flex justify-center">
                  <span className="text-[11px] text-cyan-400 font-medium bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    ⚡ Face Locked
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Position prompt */}
          <AnimatePresence>
            {!faceDetected && phase === 'scanning' && status === 'active' && currentStep !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-32 left-0 right-0 flex justify-center"
              >
                <div className="glass rounded-full px-4 py-2 text-xs text-white/60">
                  📷 Center your face in the frame
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Processing panel */}
          {phase === 'scanning' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-0 left-0 right-0 glass-strong p-4 pb-6 rounded-t-3xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <HiSparkles className="text-purple-400 w-4 h-4 flex-shrink-0" />
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #06b6d4)',
                      backgroundSize: '200% 100%',
                      animation: 'gradientShift 2s ease infinite',
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-xs text-white/40 font-mono w-8 text-right">{progress}%</span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {SCAN_STEPS.map((step, idx) => (
                  <StepItem
                    key={step.id}
                    step={step}
                    state={
                      completedSteps.includes(idx) ? 'done' :
                      currentStep === idx ? 'active' :
                      'pending'
                    }
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Camera loading */}
          {status === 'requesting' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin mx-auto mb-3" />
                <p className="text-white/50 text-sm">Accessing camera…</p>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
