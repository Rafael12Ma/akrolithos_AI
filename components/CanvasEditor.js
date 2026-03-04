"use client";

import { useState } from "react";

export default function CanvasEditor({ roomImage, wallProduct, floorProduct }) {
    const [loading, setLoading] = useState(false);
    const [resultImage, setResultImage] = useState(null);

    const generatePreview = async () => {
        if (!roomImage || (!wallProduct && !floorProduct)) return;

        try {
            setLoading(true);

            const res = await fetch("/api/ai-edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    roomImage,
                    wallImage: wallProduct?.imageUrl,
                    floorImage: floorProduct?.imageUrl,
                }),
            });

            const data = await res.json();

            if (data.image) {
                setResultImage(`data:image/png;base64,${data.image}`);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">

            <button
                onClick={generatePreview}
                disabled={loading}
                className={`px-6 py-3 rounded-xl font-medium transition
        ${loading
                        ? "bg-neutral-700 cursor-not-allowed"
                        : "bg-white text-black hover:bg-neutral-200"
                    }`}
            >
                {loading ? "Generating Preview..." : "Generate Preview"}
            </button>

            {loading && (
                <div className="flex items-center gap-3 text-neutral-400">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Rendering your stone preview...
                </div>
            )}

            {resultImage && (
                <div className="rounded-xl overflow-hidden border border-neutral-800">
                    <img src={resultImage} className="w-full" />
                </div>
            )}

        </div>
    );
}