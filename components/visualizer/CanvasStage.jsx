"use client";

import { useEffect } from "react";
import { detectWalls } from "@/lib/detectWalls";
import { projectTexture } from "@/lib/canvas/projectTexture";

export default function CanvasStage({
  canvasRef,
  roomImage,
  wallProduct,
  floorProduct,
  setPreviewImage,
}) {
  function loadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => resolve(img);
    });
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

      const baseTile = Math.min(texture.width, texture.height);
      let tileWidth = baseTile * 0.5 * scale;

      tileWidth = Math.max(80 * scale, Math.min(tileWidth, 320 * scale));
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

  async function renderScene() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const room = await loadImage(roomImage);

    canvas.width = room.width;
    canvas.height = room.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(room, 0, 0);

    const planes = detectWalls(room);
    if (!wallProduct) return;
    if (wallProduct) {
      const texture = await loadImage(wallProduct.imageUrl);

      ctx.save();

      projectTexture(ctx, texture, planes.backWall);
      drawPerspectiveTexture(ctx, texture, planes.leftWall);
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
  }, [roomImage, wallProduct, floorProduct]);
  return (
    <canvas
      ref={canvasRef}
      className="max-w-full rounded-xl border border-neutral-800"
    />
  );
}
