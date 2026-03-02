"use client";
import AdminUpload from "@/components/AdminUpload";
import CanvasEditor from "@/components/CanvasEditor";
import { useState, useEffect } from "react";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export default function Home() {
  const [roomBase64, setRoomBase64] = useState(null);
  const [roomPreview, setRoomPreview] = useState(null);
  const [stoneBase64, setStoneBase64] = useState(null);
  const [selectedStone, setSelectedStone] = useState(null);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRoomUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await toBase64(file);
    setRoomBase64(base64);
    setRoomPreview(base64);
  };

  const handleSelectTexture = async (imageUrl, id) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], "stone.jpg", { type: blob.type });
    const base64 = await toBase64(file);

    setStoneBase64(base64);
    setSelectedStone(id);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* HEADER */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Akrolithos AI Visualizer
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl">
            Preview natural stone surfaces in your space instantly.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* ROOM UPLOAD */}
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold">1. Upload Room</h2>

            <label className="flex items-center justify-center h-40 sm:h-48 border border-neutral-700 rounded-xl cursor-pointer hover:border-white transition text-center px-4">
              <span className="text-neutral-400 text-sm sm:text-base">
                Tap or click to upload
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleRoomUpload}
                className="hidden"
              />
            </label>

            {roomPreview && (
              <img
                src={roomPreview}
                alt="Room preview"
                className="w-full rounded-xl border border-neutral-700"
              />
            )}
          </div>

          {/* STONE SELECTION */}
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold">
              2. Select Stone
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectTexture(p.imageUrl, p.id)}
                  className={`cursor-pointer rounded-xl overflow-hidden transition${
                    selectedStone === p.id
                      ? "ring-2 ring-white scale-105"
                      : "border border-neutral-800 hover:border-white"
                  }
                  `}
                >
                  <img
                    src={p.imageUrl}
                    className="w-full h-24 sm:h-28 object-cover"
                  />
                  <div className="p-2 text-xs sm:text-sm text-center bg-neutral-900">
                    {p.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GENERATOR */}
        {roomBase64 && stoneBase64 && (
          <CanvasEditor roomImage={roomBase64} stoneImage={stoneBase64} />
        )}

        {/* ADMIN */}
        <div className="border-t border-neutral-800 pt-10">
          <h2 className="text-lg sm:text-xl font-semibold mb-6">Admin Panel</h2>
          <AdminUpload onUploadSuccess={fetchProducts} />{" "}
        </div>
      </div>
    </div>
  );
}
