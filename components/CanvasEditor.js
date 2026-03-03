"use client";
import { useState } from "react";

export default function CanvasEditor({ roomImage, stoneImage }) {
    const [generatedImage, setGeneratedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);

        try {
            const res = await fetch("/api/ai-edit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomImage, stoneImage }),
            });

            const data = await res.json();

            if (data.image) {
                setGeneratedImage(`data:image/png;base64,${data.image}`);
            }
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div className="space-y-10">

            <div className="text-center">
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="
            px-10 py-4
            rounded-full
            bg-white text-black
            font-medium tracking-wide
            hover:opacity-90
            transition
            shadow-lg shadow-black/30
          "
                >
                    {loading ? "Rendering..." : "Generate AI Preview"}
                </button>
            </div>

            {loading && (
                <div className="flex justify-center items-center gap-3">
                    <div className="animate-spin h-6 w-6 border-t-2 border-white rounded-full" />
                    <p className="text-neutral-400 text-sm">
                        Generating realistic preview...
                    </p>
                </div>
            )}

            {generatedImage && (
                <div className="space-y-6 text-center">
                    <h3 className="text-lg font-medium text-neutral-300">
                        Result Preview
                    </h3>

                    <div className="rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl shadow-black/40">
                        <img src={generatedImage} className="w-full" />
                    </div>
                </div>
            )}
        </div>
    );
}