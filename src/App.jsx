import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Particles from './components/shared/Particles.jsx';
import LandingScreen from './components/Landing/LandingScreen.jsx';
import ScannerScreen from './components/Scanner/ScannerScreen.jsx';
import ResultsScreen from './components/Results/ResultsScreen.jsx';

const SCREENS = { LANDING: 'landing', SCANNING: 'scanning', RESULTS: 'results' };

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LANDING);
  const [auraResult, setAuraResult] = useState(null);

  const handleStartScan = useCallback(() => setScreen(SCREENS.SCANNING), []);

  const handleScanComplete = useCallback((result) => {
    setAuraResult(result);
    setScreen(SCREENS.RESULTS);
  }, []);

  const handleRetry = useCallback(() => {
    setAuraResult(null);
    setScreen(SCREENS.SCANNING);
  }, []);

  const handleHome = useCallback(() => {
    setAuraResult(null);
    setScreen(SCREENS.LANDING);
  }, []);

  return (
    <div className="min-h-screen bg-[#050508] relative">
      <Particles count={65} />
      <AnimatePresence mode="wait">
        {screen === SCREENS.LANDING && (
          <LandingScreen key="landing" onStartScan={handleStartScan} />
        )}
        {screen === SCREENS.SCANNING && (
          <ScannerScreen key="scanning" onScanComplete={handleScanComplete} onBack={handleHome} />
        )}
        {screen === SCREENS.RESULTS && auraResult && (
          <ResultsScreen key="results" result={auraResult} onRetry={handleRetry} onHome={handleHome} />
        )}
      </AnimatePresence>
    </div>
  );
}
