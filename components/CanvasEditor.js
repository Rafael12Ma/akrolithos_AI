"use client";
import { useState, useEffect } from "react";

export default function CanvasEditor({ roomImage, stoneImage }) {
    const [generatedImage, setGeneratedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setGeneratedImage(null);
    }, [roomImage]);

    const handleGenerate = async () => {
        if (!roomImage || !stoneImage) {
            alert("Upload room image and select stone first");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/ai-edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    roomImage,
                    stoneImage,
                }),
            });

            const data = await res.json();

            if (!data.image) {
                alert("AI generation failed");
                setLoading(false);
                return;
            }

            const imgSrc = `data:image/png;base64,${data.image}`;
            setGeneratedImage(imgSrc);
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }

        setLoading(false);
    };

    return (
        <div className="space-y-4">
            <button
                onClick={handleGenerate}
                className="bg-black text-white px-6 py-3 rounded"
            >
                Generate AI Preview
            </button>

            {loading && (
                <p className="text-gray-400">
                    Generating realistic preview...
                </p>
            )}

            {generatedImage && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        AI Result
                    </h3>
                    <img
                        src={generatedImage}
                        alt="AI generated result"
                        className="max-w-full"
                    />
                </div>
            )}
        </div>
    );
}