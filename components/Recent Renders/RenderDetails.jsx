"use client";

import { useEffect, useState } from "react";

export default function RenderDetailsModal({ render, onClose }) {
  const [visible, setVisible] = useState(false);

  function formatName(name) {
    if (!name) return "";

    return name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  useEffect(() => {
    setVisible(true);
  }, []);

  if (!render) return null;

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 200); // match animation duration
  }
  console.log(render);
  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        visible ? "bg-black/80 opacity-100" : "bg-black/0 opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-neutral-900 rounded-2xl max-w-4xl w-full p-6 relative transform transition-all duration-200 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 cursor-pointer text-white text-xl"
        >
          ✕
        </button>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-neutral-400 mb-2">AI Render</p>
            <img src={render.ai_render_url} className="rounded-xl w-full" />
          </div>

          <div>
            <p className="text-sm text-neutral-400 mb-2">Preview</p>
            <img src={render.preview_url} className="rounded-xl w-full" />
          </div>
        </div>

        {/* INFO */}
        <div className="mt-6 text-sm text-neutral-400 space-y-2">
          <p>
            <strong>Date:</strong>{" "}
            {new Date(render.created_at).toLocaleString()}
          </p>

          {render.wall_product && (
            <p>
              <strong>Wall Stone:</strong>{" "}
              <span className="text-white">
                {formatName(render.wall_product)}
              </span>
            </p>
          )}

          {render.floor_product && (
            <p>
              <strong>Floor Material:</strong>{" "}
              <span className="text-white">
                {formatName(render.wall_product)}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
