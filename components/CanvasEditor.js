"use client"
import { useEffect, useRef } from "react"

export default function CanvasEditor({ image, texture }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        if (!image) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        const baseImg = new Image()
        baseImg.crossOrigin = "anonymous"
        baseImg.src = image

        baseImg.onload = () => {
            canvas.width = baseImg.width
            canvas.height = baseImg.height
            ctx.drawImage(baseImg, 0, 0)
        }
    }, [image])

    const handleClick = (e) => {
        if (!texture) return alert("Select a stone first")

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        const rect = canvas.getBoundingClientRect()
        const x = Math.floor(e.clientX - rect.left)
        const y = Math.floor(e.clientY - rect.top)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        const width = canvas.width
        const height = canvas.height

        const startIndex = (y * width + x) * 4
        const targetColor = [
            data[startIndex],
            data[startIndex + 1],
            data[startIndex + 2]
        ]

        const tolerance = 40
        const visited = new Set()
        const stack = [[x, y]]

        const texImg = new Image()
        texImg.crossOrigin = "anonymous"
        texImg.src = texture

        texImg.onload = () => {
            const tempCanvas = document.createElement("canvas")
            const tempCtx = tempCanvas.getContext("2d")
            tempCanvas.width = width
            tempCanvas.height = height
            tempCtx.drawImage(texImg, 0, 0, width, height)
            const textureData = tempCtx.getImageData(0, 0, width, height).data

            while (stack.length > 0) {
                const [cx, cy] = stack.pop()
                const index = (cy * width + cx) * 4

                if (visited.has(index)) continue
                visited.add(index)

                const r = data[index]
                const g = data[index + 1]
                const b = data[index + 2]

                const brightness = (r * 0.299 + g * 0.587 + b * 0.114)
                const targetBrightness = (
                    targetColor[0] * 0.299 +
                    targetColor[1] * 0.587 +
                    targetColor[2] * 0.114
                )

                const diff = Math.abs(brightness - targetBrightness)

                if (diff < tolerance) {
                    // Apply texture pixel
                    const alpha = 0.7

                    data[index] =
                        textureData[index] * alpha + r * (1 - alpha)

                    data[index + 1] =
                        textureData[index + 1] * alpha + g * (1 - alpha)

                    data[index + 2] =
                        textureData[index + 2] * alpha + b * (1 - alpha)

                    // Push neighbors
                    if (cx > 0) stack.push([cx - 1, cy])
                    if (cx < width - 1) stack.push([cx + 1, cy])
                    if (cy > 0) stack.push([cx, cy - 1])
                    if (cy < height - 1) stack.push([cx, cy + 1])
                }
            }

            ctx.putImageData(imageData, 0, 0)
        }
    }

    return (
        <canvas
            ref={canvasRef}
            onClick={handleClick}
            style={{ maxWidth: "100%", cursor: "crosshair" }}
        />
    )
}