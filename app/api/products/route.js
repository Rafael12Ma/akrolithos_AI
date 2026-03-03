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

  // ------------------------
  // BASE FILTERED QUERY (no pagination yet)
  // ------------------------

  let baseQuery = supabase
    .from("products")
    .select("*", { count: "exact" });

  if (surface) {
    baseQuery = baseQuery.in("surface_type", [surface, "both"]);
  }

  if (collection) baseQuery = baseQuery.eq("collection", collection);
  if (color) baseQuery = baseQuery.eq("color", color);
  if (finish) baseQuery = baseQuery.eq("finish", finish);
  if (indoor) baseQuery = baseQuery.eq("indoor_outdoor", indoor);

  // Clone for products
  let productQuery = baseQuery
    .order("createdat", { ascending: false })
    .range(from, to);

  const { data, error, count } = await productQuery;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  // ------------------------
  // FACETS (distinct values based on filtered result)
  // ------------------------

  const { data: facetData } = await baseQuery;

  const distinct = (key) =>
    [...new Set(facetData.map((p) => p[key]).filter(Boolean))];

  const facets = {
    collections: distinct("collection"),
    colors: distinct("color"),
    finishes: distinct("finish"),
    indoor: distinct("indoor_outdoor"),
  };

  return new Response(
    JSON.stringify({
      data,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      facets,
    }),
    { status: 200 }
  );
}