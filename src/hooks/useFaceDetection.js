import { useRef, useState, useCallback, useEffect } from 'react';

const isMobile = () =>
  typeof navigator !== 'undefined' &&
  (navigator.maxTouchPoints > 0 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

function isSkinTone(r, g, b) {
  const max = Math.max(r, g, b);
  const diff = max - Math.min(r, g, b);
  if (max < 60 || diff < 15) return false;
  return r > 95 && g > 40 && b > 20 && r > g && r > b && (r - g) > 15 && r < 255;
}

export function useFaceDetection(videoRef) {
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceBox, setFaceBox] = useState(null);
  const intervalRef = useRef(null);
  const consecutiveRef = useRef(0);

  // Single reused canvas — never re-created
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      // willReadFrequently tells the browser to keep pixel data in CPU memory,
      // eliminating the GPU→CPU readback that causes hitching / crashes on mobile.
      ctxRef.current = canvasRef.current.getContext('2d', { willReadFrequently: true });
    }
    return { canvas: canvasRef.current, ctx: ctxRef.current };
  }, []);

  const detectFace = useCallback(() => {
    const video = videoRef.current;
    // readyState 2 = HAVE_CURRENT_DATA — safe to drawImage
    if (!video || video.videoWidth === 0 || video.readyState < 2) return false;

    const { canvas, ctx } = getCtx();
    // Smaller sample on mobile = less pixel math + less memory pressure
    const sampleW = isMobile() ? 40 : 72;
    const sampleH = isMobile() ? 40 : 72;

    if (canvas.width !== sampleW) canvas.width = sampleW;
    if (canvas.height !== sampleH) canvas.height = sampleH;

    const vw = video.videoWidth;
    const vh = video.videoHeight;

    try {
      ctx.drawImage(video, vw * 0.25, vh * 0.1, vw * 0.5, vh * 0.6, 0, 0, sampleW, sampleH);
      const { data } = ctx.getImageData(0, 0, sampleW, sampleH);

      let skin = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (isSkinTone(data[i], data[i + 1], data[i + 2])) skin++;
      }
      return skin / (sampleW * sampleH) > 0.12;
    } catch {
      return false;
    }
  }, [videoRef, getCtx]);

  const startDetection = useCallback(() => {
    if (intervalRef.current) return;
    // Slower polling on mobile: less CPU contention with the camera stream
    const interval = isMobile() ? 700 : 420;
    intervalRef.current = setInterval(() => {
      const detected = detectFace();
      consecutiveRef.current = detected
        ? consecutiveRef.current + 1
        : Math.max(0, consecutiveRef.current - 1);

      const stable = consecutiveRef.current >= 2;
      setFaceDetected(stable);

      if (stable) {
        const video = videoRef.current;
        const w = video?.videoWidth || 640;
        const h = video?.videoHeight || 480;
        setFaceBox({ x: w * 0.28, y: h * 0.1, width: w * 0.44, height: h * 0.65 });
      } else {
        setFaceBox(null);
      }
    }, interval);
  }, [detectFace, videoRef]);

  const stopDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Release the reused canvas memory
    if (canvasRef.current) {
      canvasRef.current.width = 0;
      canvasRef.current.height = 0;
    }
    setFaceDetected(false);
    setFaceBox(null);
    consecutiveRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (canvasRef.current) {
        canvasRef.current.width = 0;
        canvasRef.current.height = 0;
      }
    };
  }, []);

  return { faceDetected, faceBox, startDetection, stopDetection };
}
