"use client";

import { useEffect, useState } from "react";
import { createWallMask } from "@/lib/wallmask";
import { detectWalls } from "@/lib/detectWalls";

export default function CanvasStage({
  canvasRef,
  roomImage,
  wallProduct,
  floorProduct,
  setPreviewImage,
}) {
  const [wallMask, setWallMask] = useState(null);

  function loadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => resolve(img);
    });
  }

  function handleCanvasClick(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    const mask = createWallMask(canvas, x, y);

    setWallMask(mask);
  }

  function drawPolygon(ctx, points) {
    ctx.beginPath();

    points.forEach(([x, y], i) => {
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.closePath();
  }

  function drawPerspectiveTexture(ctx, texture, polygon, rows = 18) {
    const [tl, tr, br, bl] = polygon;

    for (let i = 0; i < rows; i++) {
      const t0 = i / rows;
      const t1 = (i + 1) / rows;

      const yTop = tl[1] + (bl[1] - tl[1]) * t0;
      const yBottom = tl[1] + (bl[1] - tl[1]) * t1;

      const leftTop = tl[0] + (bl[0] - tl[0]) * t0;
      const rightTop = tr[0] + (br[0] - tr[0]) * t0;

      const rowHeight = yBottom - yTop;

      const scale = 1 - t0 * 0.6;

      const tileWidth = texture.width * scale;

      ctx.save();

      ctx.beginPath();
      ctx.moveTo(leftTop, yTop);
      ctx.lineTo(rightTop, yTop);
      ctx.lineTo(rightTop, yBottom);
      ctx.lineTo(leftTop, yBottom);
      ctx.closePath();
      ctx.clip();

      for (let x = leftTop; x < rightTop; x += tileWidth) {
        ctx.drawImage(texture, x, yTop, tileWidth, rowHeight);
      }

      ctx.restore();
    }
  }

  function applyMask(ctx, mask, canvas) {
    if (!mask) return;

    const maskCanvas = document.createElement("canvas");

    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;

    const maskCtx = maskCanvas.getContext("2d");

    const imgData = maskCtx.createImageData(canvas.width, canvas.height);

    for (let i = 0; i < mask.data.length; i++) {
      const val = mask.data[i] ? 255 : 0;

      imgData.data[i * 4] = val;
      imgData.data[i * 4 + 1] = val;
      imgData.data[i * 4 + 2] = val;
      imgData.data[i * 4 + 3] = val;
    }

    maskCtx.putImageData(imgData, 0, 0);

    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(maskCanvas, 0, 0);
    ctx.globalCompositeOperation = "source-over";
  }

  async function renderScene() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const room = await loadImage(roomImage);

    canvas.width = room.width;
    canvas.height = room.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(room, 0, 0);

    const planes = detectWalls(room);

    if (wallProduct && wallMask) {
      const texture = await loadImage(wallProduct.imageUrl);

      ctx.save();

      drawPerspectiveTexture(ctx, texture, planes.backWall);

      drawPerspectiveTexture(ctx, texture, planes.leftWall);

      applyMask(ctx, wallMask, canvas);

      ctx.restore();
    }

    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = 0.35;

    ctx.drawImage(room, 0, 0);

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    const preview = canvas.toDataURL("image/jpeg", 0.92);

    setPreviewImage(preview);
  }

  useEffect(() => {
    if (!roomImage) return;

    renderScene();
  }, [roomImage, wallProduct, floorProduct, wallMask]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      className="max-w-full rounded-xl border border-neutral-800 cursor-crosshair"
    />
  );
}
