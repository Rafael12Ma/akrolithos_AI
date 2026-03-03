import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
        .from("products")
        .select("collection, color, finish, indoor_outdoor");

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }

    const unique = (key) =>
        [...new Set(data.map((item) => item[key]).filter(Boolean))];

    return new Response(
        JSON.stringify({
            collections: unique("collection"),
            colors: unique("color"),
            finishes: unique("finish"),
            indoorOptions: unique("indoor_outdoor"),
        }),
        { status: 200 }
    );
}