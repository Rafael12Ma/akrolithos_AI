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
        <div className="space-y-8">

            <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold transition bg-white text-black hover:opacity-90"
            >
                {loading ? "Rendering..." : "Generate AI Preview"}
            </button>

            {loading && (
                <div className="flex items-center gap-3">
                    <div className="animate-spin h-6 w-6 border-t-2 border-white rounded-full" />
                    <p className="text-neutral-400 text-sm">
                        Generating showroom preview...
                    </p>
                </div>
            )}

            {generatedImage && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                        AI Result
                    </h3>
                    <img
                        src={generatedImage}
                        className="w-full rounded-xl border border-neutral-700"
                    />
                </div>
            )}
        </div>
    );
}