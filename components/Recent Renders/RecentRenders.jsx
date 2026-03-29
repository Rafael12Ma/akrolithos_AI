"use client";

import { useEffect, useState } from "react";

export default function RecentRenders({ onSelect }) {
  const [renders, setRenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/renders/latest")
      .then((res) => res.json())
      .then((data) => {
        setRenders(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-gray-400">Loading recent renders...</div>
    );
  }

  if (!renders.length) {
    return <div className="text-sm text-gray-400">No renders yet</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-2">Recent Renders</h3>

      <div className="flex gap-3 overflow-x-auto">
        {renders.map((render) => (
          <div
            key={render.id}
            onClick={() => onSelect(render)}
            className="cursor-pointer border rounded-md overflow-hidden hover:opacity-80 transition"
          >
            <img
              src={render.ai_render_url}
              alt=""
              className="w-24 h-24 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
