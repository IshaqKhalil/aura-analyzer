import { useRef, useState, useCallback, useEffect } from 'react';

// Lightweight skin-tone heuristic face detection using canvas sampling.
// Samples a grid of pixels and looks for skin-tone-range colors in the center region.
function detectFaceHeuristic(videoEl) {
  if (!videoEl || videoEl.videoWidth === 0) return false;
  const w = videoEl.videoWidth;
  const h = videoEl.videoHeight;

  const canvas = document.createElement('canvas');
  const sampleW = 80;
  const sampleH = 80;
  canvas.width = sampleW;
  canvas.height = sampleH;
  const ctx = canvas.getContext('2d');

  // Sample only the center 50% of the frame
  const srcX = w * 0.25;
  const srcY = h * 0.1;
  const srcW = w * 0.5;
  const srcH = h * 0.6;

  ctx.drawImage(videoEl, srcX, srcY, srcW, srcH, 0, 0, sampleW, sampleH);
  const { data } = ctx.getImageData(0, 0, sampleW, sampleH);

  let skinPixels = 0;
  const total = sampleW * sampleH;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (isSkinTone(r, g, b)) skinPixels++;
  }

  const ratio = skinPixels / total;
  return ratio > 0.12; // at least 12% skin-tone pixels
}

function isSkinTone(r, g, b) {
  // HSV-based skin detection heuristic
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  if (max < 60) return false; // too dark
  if (diff < 15) return false; // too gray/white

  // Rough RGB rule: r > g > b, and strong red channel
  return r > 95 && g > 40 && b > 20 &&
         r > g && r > b &&
         (r - g) > 15 &&
         r < 255;
}

export function useFaceDetection(videoRef) {
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceBox, setFaceBox] = useState(null);
  const intervalRef = useRef(null);
  const consecutiveRef = useRef(0);

  const startDetection = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      const video = videoRef.current;
      if (!video) return;

      const detected = detectFaceHeuristic(video);
      if (detected) {
        consecutiveRef.current++;
      } else {
        consecutiveRef.current = Math.max(0, consecutiveRef.current - 1);
      }

      const stable = consecutiveRef.current >= 2;
      setFaceDetected(stable);

      if (stable) {
        // Synthetic face box based on center of frame
        const w = video.videoWidth || 640;
        const h = video.videoHeight || 480;
        setFaceBox({
          x: w * 0.28,
          y: h * 0.1,
          width: w * 0.44,
          height: h * 0.65,
        });
      } else {
        setFaceBox(null);
      }
    }, 400);
  }, [videoRef]);

  const stopDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setFaceDetected(false);
    setFaceBox(null);
    consecutiveRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { faceDetected, faceBox, startDetection, stopDetection };
}
