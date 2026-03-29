import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET() {
    const { data, error } = await supabase
        .from("generated_renders")
        .select("id, preview_url, ai_render_url, created_at")
        .order("created_at", { ascending: false })
        .limit(5)

    if (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(data)
}