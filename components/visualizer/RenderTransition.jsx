"use client";

import { useEffect, useState } from "react";
import ReactCompareImage from "react-compare-image";

export default function RenderTransition({ previewImage, aiImage }) {
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    if (!aiImage) return;

    const timer = setTimeout(() => {
      setShowAI(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [aiImage]);

  if (!previewImage) return null;

  return (
    <div className="w-full max-w-5xl mt-6 relative">
      {/* Blur animation */}
      <div
        className={`transition-all duration-700 ${
          showAI ? "blur-0 opacity-100" : "blur-sm opacity-80"
        }`}
      >
        {aiImage ? (
          <ReactCompareImage leftImage={previewImage} rightImage={aiImage} />
        ) : (
          <img src={previewImage} className="rounded-xl" />
        )}
      </div>
    </div>
  );
}
