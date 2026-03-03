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

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const surface = searchParams.get("surface");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "24");

  const collection = searchParams.get("collection");
  const color = searchParams.get("color");
  const finish = searchParams.get("finish");
  const indoor = searchParams.get("indoor");

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .in("surface_type", [surface, "both"]);

  if (collection) query = query.eq("collection", collection);
  if (color) query = query.eq("color", color);
  if (finish) query = query.eq("finish", finish);
  if (indoor) query = query.eq("indoor_outdoor", indoor);

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ data, total: count }), {
    status: 200,
  });
} 