"use client";
import { useState } from "react";

export default function AdminUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [stoneName, setStoneName] = useState("");
  const [surfaceType, setSurfaceType] = useState("wall");
  const [collection, setCollection] = useState("");
  const [color, setColor] = useState("");
  const [finish, setFinish] = useState("");
  const [indoorOutdoor, setIndoorOutdoor] = useState("indoor");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !stoneName) return;

    setUploading(true);

    // Upload to Supabase Storage
    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();
    if (uploadData.error) {
      setUploading(false);
      return;
    }

    // Insert into products table
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: stoneName,
        imageUrl: uploadData.url,
        surface_type: surfaceType,
        collection,
        color,
        finish,
        indoor_outdoor: indoorOutdoor,
        is_active: true,
      }),
    });

    setUploading(false);

    if (onUploadSuccess) {
      onUploadSuccess();
    }

    // reset
    setStoneName("");
    setCollection("");
    setColor("");
    setFinish("");
  };

  return (
    <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-4 max-w-md">
      <input
        type="text"
        placeholder="Stone name"
        value={stoneName}
        onChange={(e) => setStoneName(e.target.value)}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2"
      />

      <select
        value={surfaceType}
        onChange={(e) => setSurfaceType(e.target.value)}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2"
      >
        <option value="wall">Wall</option>
        <option value="floor">Floor</option>
        <option value="both">Both</option>
      </select>

      <input
        type="text"
        placeholder="Collection"
        value={collection}
        onChange={(e) => setCollection(e.target.value)}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2"
      />

      <input
        type="text"
        placeholder="Color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2"
      />

      <input
        type="text"
        placeholder="Finish"
        value={finish}
        onChange={(e) => setFinish(e.target.value)}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2"
      />

      <select
        value={indoorOutdoor}
        onChange={(e) => setIndoorOutdoor(e.target.value)}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2"
      >
        <option value="indoor">Indoor</option>
        <option value="outdoor">Outdoor</option>
        <option value="both">Both</option>
      </select>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full bg-white text-black py-2 rounded-lg font-medium"
      >
        {uploading ? "Uploading..." : "Upload Product"}
      </button>
    </div>
  );
}
