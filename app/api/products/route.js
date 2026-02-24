import { supabase } from "@/lib/supabase"

export async function POST(req) {
  try {
    const body = await req.json()
    console.log("Incoming body:", body)

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name: body.name,
          imageUrl: body.imageUrl,
        },
      ])
      .select()

    if (error) {
      console.error("Insert error:", error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      })
    }

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (err) {
    console.error("Server error:", err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    })
  }
}

export async function GET() {
  const { data, error } = await supabase.from("products").select("*")

  if (error) {
    console.error("Fetch error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }

  return new Response(JSON.stringify(data), { status: 200 })
}