"use client";
import AdminUpload from "@/components/AdminUpload";
import CanvasEditor from "@/components/CanvasEditor";
import { useState, useEffect } from "react";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedTexture, setSelectedTexture] = useState(null);

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

  return (
    <div className="p-10 space-y-6">
      {/* 1️⃣ Upload Room Photo */}
      <div>
        <h2 className="text-lg font-bold mb-2">Upload Room Photo</h2>
        <input
          type="file"
          onChange={(e) =>
            setUploadedImage(URL.createObjectURL(e.target.files[0]))
          }
        />
      </div>

      {/* 2️⃣ Show Stone Textures */}
      <div>
        <h2 className="text-lg font-bold mb-2">Select Stone</h2>
        <div className="flex flex-wrap gap-4">
          {products.map((p) => (
            <div key={p.id} className="text-center">
              <img
                src={p.imageUrl}
                className="w-24 h-24 object-cover cursor-pointer border hover:border-white"
                onClick={() => setSelectedTexture(p.imageUrl)}
              />
              <p className="text-sm mt-1">{p.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3️⃣ Canvas Visualizer */}
      {uploadedImage && (
        <CanvasEditor image={uploadedImage} texture={selectedTexture} />
      )}

      {/* 4️⃣ Admin Panel */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-lg font-bold mb-2">Admin Upload</h2>
        <AdminUpload />
      </div>
    </div>
  );
}
