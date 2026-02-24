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
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("API returned error:", data);
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setProducts([]);
      });
  }, []);

  // Upload Room Image
  const handleRoomUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await toBase64(file);
    setRoomBase64(base64);
    setRoomPreview(base64);
  };

  // Select Stone Texture
  const handleSelectTexture = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "stone.jpg", { type: blob.type });

      const base64 = await toBase64(file);
      setStoneBase64(base64);
    } catch (err) {
      console.error("Failed to fetch stone image:", err);
    }
  };

  return (
    <div className="p-10 space-y-8">
      {/* 1️⃣ Upload Room */}
      <div>
        <h2 className="text-lg font-bold mb-2">Upload Room Photo</h2>
        <input type="file" accept="image/*" onChange={handleRoomUpload} />

        {roomPreview && (
          <img
            src={roomPreview}
            alt="Room preview"
            className="mt-4 max-w-md border"
          />
        )}
      </div>

      {/* 2️⃣ Select Stone */}
      <div>
        <h2 className="text-lg font-bold mb-2">Select Stone</h2>
        <div className="flex flex-wrap gap-4">
          {products.map((p) => (
            <div key={p.id} className="text-center">
              <img
                src={p.imageUrl}
                className="w-24 h-24 object-cover cursor-pointer border hover:border-white"
                onClick={() => handleSelectTexture(p.imageUrl)}
              />
              <p className="text-sm mt-1">{p.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3️⃣ AI Generator */}
      {roomBase64 && stoneBase64 && (
        <CanvasEditor roomImage={roomBase64} stoneImage={stoneBase64} />
      )}

      {/* 4️⃣ Admin */}
      <div className="mt-12 border-t pt-6">
        <h2 className="text-lg font-bold mb-2">Admin Upload</h2>
        <AdminUpload />
      </div>
    </div>
  );
}
