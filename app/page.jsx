"use client";

import ProductSelectorModal from "@/components/ProductSelectorModal";
import CanvasEditor from "@/components/CanvasEditor";
import { useState, useRef } from "react";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export default function Home() {
  const [roomImage, setRoomImage] = useState(null);
  const fileInputRef = useRef(null);
  const [wallProduct, setWallProduct] = useState(null);
  const [floorProduct, setFloorProduct] = useState(null);

  const [openSelector, setOpenSelector] = useState(null);

  const handleRoomUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await toBase64(file);
    setRoomImage(base64);

    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Visualize Stone In Your Space
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Upload your room, select wall and floor surfaces, generate a
            realistic showroom preview.
          </p>
        </div>

        {/* ROOM UPLOAD */}
        {/* ROOM UPLOAD */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">1. Upload Room</h2>

          {!roomImage ? (
            <div
              onClick={() => fileInputRef.current.click()}
              className="
      flex items-center justify-center
      h-44 sm:h-56 md:h-72
      border border-neutral-700
      rounded-2xl
      hover:border-white
      transition
      text-neutral-400
      cursor-pointer
      "
            >
              Click to upload room image
            </div>
          ) : (
            <div
              className="
  relative
  w-full
  rounded-2xl
  overflow-hidden
  border border-neutral-800
  flex
  items-center
  justify-center
  bg-neutral-950
  h-56
  sm:h-72
  md:h-[420px]
  lg:h-[520px]
  "
            >
              <img
                src={roomImage}
                alt="Room preview"
                className="max-h-full max-w-full object-contain"
              />

              <button
                onClick={() => fileInputRef.current.click()}
                className="
    absolute
    top-3 right-3
    sm:top-4 sm:right-4
    bg-black/70
    backdrop-blur
    px-3 py-1.5
    sm:px-4 sm:py-2
    text-xs sm:text-sm
    rounded-lg
    hover:bg-black
    transition
    "
              >
                Change Image
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleRoomUpload}
            className="hidden"
          />
        </div>

        {/* SURFACE SELECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WALL */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold">Wall Surface</h3>

            {wallProduct ? (
              <div className="flex items-center gap-4">
                <img
                  src={wallProduct.imageUrl}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium">{wallProduct.name}</p>
                  <button
                    onClick={() => setOpenSelector("wall")}
                    className="text-sm text-neutral-400 hover:text-white"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setOpenSelector("wall")}
                className="w-full bg-white text-black py-3 rounded-xl font-medium"
              >
                Select Wall Product
              </button>
            )}
          </div>

          {/* FLOOR */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold">Floor Surface</h3>

            {floorProduct ? (
              <div className="flex items-center gap-4">
                <img
                  src={floorProduct.imageUrl}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium">{floorProduct.name}</p>
                  <button
                    onClick={() => setOpenSelector("floor")}
                    className="text-sm text-neutral-400 hover:text-white"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setOpenSelector("floor")}
                className="w-full bg-white text-black py-3 rounded-xl font-medium"
              >
                Select Floor Product
              </button>
            )}
          </div>
        </div>

        {/* CANVAS EDITOR */}
        {roomImage && (
          <CanvasEditor
            roomImage={roomImage}
            wallProduct={wallProduct}
            floorProduct={floorProduct}
          />
        )}
      </div>

      {/* PRODUCT SELECTOR MODAL */}
      {openSelector && (
        <ProductSelectorModal
          surface={openSelector}
          onClose={() => setOpenSelector(null)}
          onSelect={(product) => {
            if (openSelector === "wall") setWallProduct(product);
            if (openSelector === "floor") setFloorProduct(product);
            setOpenSelector(null);
          }}
        />
      )}
    </div>
  );
}
