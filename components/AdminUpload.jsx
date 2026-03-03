"use client";
import { useState } from "react";

export default function AdminUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [stoneName, setStoneName] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
  };

  const handleUpload = async () => {
    if (!file || !stoneName) return;

    setUploading(true);

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

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: stoneName,
        imageUrl: uploadData.url,
      }),
    });

    setPreviewImage(null);
    setFile(null);
    setStoneName("");
    setUploading(false);

    if (onUploadSuccess) {
      onUploadSuccess();
    }
  };

  return (
    <>
      <div className="bg-neutral-900/70 backdrop-blur p-6 rounded-2xl border border-neutral-800 space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Stone name"
          value={stoneName}
          onChange={(e) => setStoneName(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-sm"
        />

        <input type="file" onChange={handleFileChange} className="text-sm" />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-white text-black py-2 rounded-lg font-medium"
        >
          {uploading ? "Uploading..." : "Upload Stone"}
        </button>
      </div>

      {previewImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="relative bg-neutral-900 rounded-2xl p-6 w-full max-w-xl max-h-[85vh] overflow-auto">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded"
            >
              ✕
            </button>

            <img
              src={previewImage}
              className="w-full max-h-[60vh] object-contain rounded-xl"
            />

            <div className="mt-6 text-center">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
              >
                {uploading ? "Uploading..." : "Confirm Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
