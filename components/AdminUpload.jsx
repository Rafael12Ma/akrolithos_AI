"use client";
import { useState } from "react";

export default function AdminUpload() {
  const [file, setFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState(null);
  const [stoneName, setStoneName] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file || !stoneName) return alert("Select a file and enter a name");

    // Upload file to Supabase Storage
    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();
    if (uploadData.error) {
      console.log(uploadData);
      return alert("Upload failed: " + uploadData.error);
    }
    // Store product in Supabase table
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: stoneName, imageUrl: uploadData.url }),
    });

    const productData = await res.json();
    if (productData.error) return alert("Saving product failed");

    setUploadUrl(uploadData.url);
    alert("Stone uploaded successfully!");
  };

  return (
   <h1>test</h1>
  );
}
