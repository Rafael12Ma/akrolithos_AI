"use client";
import { useState } from "react";

export default function CanvasEditor({
    roomImage,
    wallProduct,
    floorProduct,
}) {
    const [generatedImage, setGeneratedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);

        const res = await fetch("/api/ai-edit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                roomImage,
                wallImage: wallProduct?.imageUrl,
                floorImage: floorProduct?.imageUrl,
            }),
        });

        const data = await res.json();

        if (data.image) {
            setGeneratedImage(`data:image/png;base64,${data.image}`);
        }

        setLoading(false);
    };

    return (
        <div className="space-y-6">

            <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-white text-black px-8 py-4 rounded-xl font-semibold"
            >
                {loading ? "Rendering..." : "Generate Preview"}
            </button>

            {generatedImage && (
                <img
                    src={generatedImage}
                    className="w-full rounded-2xl border border-neutral-800"
                />
            )}
        </div>
    );
}