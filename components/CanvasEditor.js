"use client";

import { useRef, useState } from "react";

import CanvasStage from "./visualizer/CanvasStage";
import GenerateButton from "./visualizer/GenerateButton";
import RenderStatus from "./visualizer/RenderStatus";
import RenderTransition from "./visualizer/RenderTransition";


export default function CanvasEditor({
    roomImage,
    wallProduct,
    floorProduct
}) {

    const canvasRef = useRef(null);

    const [previewImage, setPreviewImage] = useState(null);
    const [aiImage, setAiImage] = useState(null);
    const [generating, setGenerating] = useState(false);

    // ✅ Select past render
    function handleSelectRender(render) {
        if (!render) return;

        setPreviewImage(render.preview_url);
        setAiImage(render.ai_render_url);
    }

    // ✅ Generate AI render
    async function generateRender() {

        const canvas = canvasRef.current;

        if (!canvas) {
            console.error("Canvas not ready");
            return;
        }

        try {
            const preview = canvas.toDataURL("image/jpeg", 0.9);

            setPreviewImage(preview);
            setAiImage(null); // ✅ reset old AI result
            setGenerating(true);

            const res = await fetch("/api/ai-edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    previewImage: preview,
                    wallProduct: wallProduct?.name || null,
                    floorProduct: floorProduct?.name || null
                })
            });

            if (!res.ok) {
                throw new Error("Failed to generate render");
            }

            const data = await res.json();

            setAiImage(data.aiImage);

        } catch (err) {
            console.error("Render error:", err);
        } finally {
            setGenerating(false);
        }
    }

    return (
        <div className="w-full flex flex-col items-center gap-6 mt-10">

            {/* ✅ Recent renders FIRST */}

            {/* ✅ Canvas */}
            <CanvasStage
                canvasRef={canvasRef}
                roomImage={roomImage}
                wallProduct={wallProduct}
                floorProduct={floorProduct}
                setPreviewImage={setPreviewImage}
            />

            {/* ✅ Generate button */}
            <GenerateButton
                generating={generating}
                onClick={generateRender}
            />

            {/* ✅ Progress UI */}
            <RenderStatus generating={generating} />

            {/* ✅ Result */}
            {previewImage && aiImage && (
                <RenderTransition
                    previewImage={previewImage}
                    aiImage={aiImage}
                />
            )}

        </div>
    );
}