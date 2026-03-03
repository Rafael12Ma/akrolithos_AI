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
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        {/* HERO */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            Visualize Natural Stone
            <span className="block text-neutral-400 font-light mt-2">
              In Your Own Space
            </span>
          </h1>

          <p className="text-neutral-500 text-sm sm:text-base">
            Upload a photo. Select a surface. Generate a realistic preview
            instantly.
          </p>
        </div>

        {/* MAIN SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
          {/* ROOM */}
          {/* ROOM */}
          <div className="space-y-8">
            <h2 className="text-lg sm:text-xl font-medium text-neutral-300">
              1. Upload Room
            </h2>

            <div className="relative">
              {!roomPreview && (
                <label
                  className="
          flex items-center justify-center
          h-44 sm:h-56
          border border-dashed border-neutral-700
          rounded-2xl
          bg-neutral-900/40
          hover:border-neutral-400
          transition
          cursor-pointer
          text-center px-6
        "
                >
                  <span className="text-neutral-500 text-sm sm:text-base">
                    Click or tap to upload your room image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleRoomUpload}
                    className="hidden"
                  />
                </label>
              )}

              {roomPreview && (
                <div className="relative group rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl shadow-black/40">
                  <img
                    src={roomPreview}
                    alt="Room preview"
                    className="w-full h-44 sm:h-56 object-cover transition duration-300 group-hover:brightness-75"
                  />

                  {/* Change Image Overlay */}
                  <label
                    className="
    absolute bottom-4 right-4
    bg-black/70 backdrop-blur-sm
    px-4 py-2
    rounded-full
    text-white text-sm font-medium
    transition
    cursor-pointer

    opacity-100 sm:opacity-0
    sm:group-hover:opacity-100
  "
                  >
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleRoomUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* STONES */}
          <div className="space-y-8">
            <h2 className="text-lg sm:text-xl font-medium text-neutral-300">
              2. Select Stone
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectTexture(p.imageUrl, p.id)}
                  className={`
                    group cursor-pointer rounded-2xl overflow-hidden
                    transition-all duration-300
                    ${
                      selectedStone === p.id
                        ? "ring-2 ring-white scale-[1.03]"
                        : "border border-neutral-800 hover:border-neutral-500"
                    }
                  `}
                >
                  <img
                    src={p.imageUrl}
                    className="w-full h-28 object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="p-3 text-xs sm:text-sm text-center bg-neutral-900">
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

        {/* DIVIDER */}
        <div className="h-px bg-neutral-800" />

        {/* ADMIN */}
        <div className="space-y-6">
          <h2 className="text-lg sm:text-xl font-medium text-neutral-400">
            Admin Panel
          </h2>
          <AdminUpload onUploadSuccess={fetchProducts} />
        </div>
      </div>
    </div>
  );
}
