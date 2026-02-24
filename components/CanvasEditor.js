"use client"
import { useEffect, useRef } from "react"

export default function CanvasEditor({ image, texture }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const img = new Image()
    img.src = image

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
    }
  }, [image])

  const handleClick = (e) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4

    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]

    console.log("Clicked color:", r, g, b)

    alert("Next step: implement flood fill here")
  }

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      style={{ maxWidth: "100%", cursor: "crosshair" }}
    />
  )
}