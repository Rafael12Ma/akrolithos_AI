"use client";

import { useRef, useState } from "react";

import CanvasStage from "./visualizer/CanvasStage";
import GenerateButton from "./visualizer/GenerateButton";
import RenderCompare from "./visualizer/RenderCompare";
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

    async function generateRender() {

        const canvas = canvasRef.current;

        const preview = canvas.toDataURL("image/jpeg", 0.92);

        setPreviewImage(preview);

        setGenerating(true);

        const res = await fetch("/api/ai-edit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                previewImage: preview
            })
        });

        const data = await res.json();

        setAiImage(data.aiImage);

        setGenerating(false);
    }

    return (

        <div className="w-full flex flex-col items-center gap-6 mt-10">

            <CanvasStage
                canvasRef={canvasRef}
                roomImage={roomImage}
                wallProduct={wallProduct}
                floorProduct={floorProduct}
                setPreviewImage={setPreviewImage}
            />

            <GenerateButton
                generating={generating}
                onClick={generateRender}
            />

            <RenderStatus generating={generating} />

            {previewImage && aiImage && (
                <RenderTransition
                    previewImage={previewImage}
                    aiImage={aiImage}
                />
            )}

        </div>
    );
}