"use client";

import { useEffect, useRef, useState } from "react";

export default function CanvasEditor({
    roomImage,
    wallProduct,
    floorProduct
}) {

    const canvasRef = useRef(null);
    const [generating, setGenerating] = useState(false);
    const [renderedImage, setRenderedImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("");
    useEffect(() => {
        if (!roomImage) return;
        renderScene();
    }, [roomImage, wallProduct, floorProduct]);

    async function renderScene() {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const room = new Image();
        room.src = roomImage;

        room.onload = async () => {

            canvas.width = room.width;
            canvas.height = room.height;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // draw base room
            ctx.drawImage(room, 0, 0);

            const wallTop = 0;
            const wallBottom = canvas.height * 0.60;

            const floorTop = wallBottom;

            // ---------- WALL ----------
            if (wallProduct) {

                const texture = new Image();
                texture.crossOrigin = "anonymous";
                texture.src = wallProduct.imageUrl;

                await new Promise(res => texture.onload = res);

                // scale texture (important)
                const texCanvas = document.createElement("canvas");
                const texCtx = texCanvas.getContext("2d");

                const scale = 0.25;

                texCanvas.width = texture.width * scale;
                texCanvas.height = texture.height * scale;

                texCtx.drawImage(
                    texture,
                    0,
                    0,
                    texCanvas.width,
                    texCanvas.height
                );

                const pattern = ctx.createPattern(texCanvas, "repeat");

                ctx.save();

                // create simple perspective trapezoid
                ctx.beginPath();
                ctx.moveTo(canvas.width * 0.1, wallTop);
                ctx.lineTo(canvas.width * 0.9, wallTop);
                ctx.lineTo(canvas.width * 1.05, wallBottom);
                ctx.lineTo(canvas.width * -0.05, wallBottom);
                ctx.closePath();

                ctx.clip();

                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, canvas.width, wallBottom);

                ctx.restore();
            }

            // ---------- FLOOR ----------
            if (floorProduct) {

                const texture = new Image();
                texture.crossOrigin = "anonymous";
                texture.src = floorProduct.imageUrl;

                await new Promise(res => texture.onload = res);

                const texCanvas = document.createElement("canvas");
                const texCtx = texCanvas.getContext("2d");

                const scale = 0.3;

                texCanvas.width = texture.width * scale;
                texCanvas.height = texture.height * scale;

                texCtx.drawImage(texture, 0, 0, texCanvas.width, texCanvas.height);

                const pattern = ctx.createPattern(texCanvas, "repeat");

                ctx.save();

                ctx.beginPath();
                ctx.moveTo(0, floorTop);
                ctx.lineTo(canvas.width, floorTop);
                ctx.lineTo(canvas.width * 1.2, canvas.height);
                ctx.lineTo(canvas.width * -0.2, canvas.height);
                ctx.closePath();

                ctx.clip();

                ctx.fillStyle = pattern;
                ctx.fillRect(0, floorTop, canvas.width, canvas.height);

                ctx.restore();
            }
        };
    }

    async function generateRender() {

        const canvas = canvasRef.current;

        setGenerating(true);
        setProgress(5);
        setStatus("Preparing preview...");

        const previewImage = canvas.toDataURL("image/jpeg", 0.9);

        // fake progress updates while waiting
        const progressTimer = setInterval(() => {

            setProgress((p) => {
                if (p >= 90) return p;
                return p + 5;
            });

            setStatus((s) => {

                if (progress < 30) return "Analyzing room...";
                if (progress < 60) return "Rendering stone surfaces...";
                if (progress < 80) return "Enhancing realism...";
                return "Finalizing render...";
            });

        }, 500);

        const res = await fetch("/api/ai-edit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                previewImage
            })
        });

        const data = await res.json();

        clearInterval(progressTimer);

        setProgress(100);
        setStatus("Render completed");

        setRenderedImage(data.image);

        setTimeout(() => {
            setGenerating(false);
            setProgress(0);
        }, 800);
    }

    return (

        <div className="w-full flex flex-col items-center gap-6 mt-10">

            <canvas
                ref={canvasRef}
                className="max-w-full rounded-xl border border-neutral-800"
            />

            <button
                onClick={generateRender}
                disabled={generating}
                className="px-6 py-3 bg-white text-black rounded-xl font-semibold disabled:opacity-50"
            >
                {generating ? "Generating..." : "Generate Photorealistic Render"}
            </button>
            {generating && (
                <div className="w-full max-w-xl mt-4">

                    <div className="text-sm text-neutral-400 mb-2">
                        {status}
                    </div>

                    <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                </div>
            )}
            {renderedImage && (
                <img
                    src={renderedImage}
                    className="rounded-xl border border-neutral-800 max-w-full"
                />
            )}

        </div>

    );

}