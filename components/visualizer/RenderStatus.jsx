"use client";

import { useEffect, useState } from "react";

export default function RenderStatus({ generating }) {
  const steps = [
    "Preparing preview",
    "Applying materials",
    "Enhancing lighting",
    "Finalizing render",
  ];

  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!generating) {
      setProgress(0);
      return;
    }

    setStepIndex(0);
    setProgress(5);

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 5;
      });
    }, 800);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [generating]);

  if (!generating) return null;

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4 mt-6">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-neutral-700 border-t-white rounded-full animate-spin"></div>

      {/* Status text */}
      <p className="text-neutral-300 text-sm animate-pulse">
        {steps[stepIndex]}...
      </p>

      {/* Progress bar */}
      <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-white h-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-neutral-500">
        Rendering photorealistic image...
      </p>
    </div>
  );
}
