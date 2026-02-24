import { supabase } from "@/lib/supabase"

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 })
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const fileName = `stones/${Date.now()}-${file.name}`

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, buffer, {
        contentType: file.type,
      })

    if (error) {
      console.error("UPLOAD ERROR:", error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    const { data: publicData } = supabase.storage
      .from("uploads")
      .getPublicUrl(fileName)

    return new Response(
      JSON.stringify({ url: publicData.publicUrl }),
      { status: 200 }
    )
  } catch (err) {
    console.error("SERVER ERROR:", err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}