"use client"
import AdminUpload from "@/components/AdminUpload"
import CanvasEditor from "@/components/CanvasEditor"
import { useState, useEffect } from "react"
import { Stage, Layer, Image as KonvaImage } from "react-konva"
import useImage from "use-image"

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [products, setProducts] = useState([])
  const [selectedTexture, setSelectedTexture] = useState(null)

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data)
        } else {
          console.error("API returned error:", data)
          setProducts([]) // fallback to empty array
        }
      })
      .catch(err => {
        console.error("Fetch error:", err)
        setProducts([]) // fallback
      })
  }, [])

  return (
    <div className="p-10 space-y-6">
      {/* <input
        type="file"
        onChange={(e) =>
          setUploadedImage(URL.createObjectURL(e.target.files[0]))
        }
      /> */}

      <div className="flex flex-wrap gap-4">
        {products.map((p) => (
          <div key={p.id} className="text-center">
            <img
              src={p.imageUrl}
              className="w-24 h-24 object-cover cursor-pointer border hover:border-black"
              onClick={() => setSelectedTexture(p.imageUrl)}
            />
            <p className="text-sm mt-1">{p.name}</p>
          </div>
        ))}
      </div>
      <AdminUpload />
      {uploadedImage && (
        <CanvasEditor
          image={uploadedImage}
          texture={selectedTexture}
        />
      )}
    </div>
  )
}