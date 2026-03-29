import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/SupabaseAdmin";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

function slugify(str) {
    return str
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export async function POST(req) {
    try {
        const body = await req.json();

        const {
            previewImage,
            wallProduct,
            floorProduct
        } = body;

        if (!previewImage) {
            return Response.json(
                { error: "Missing preview image" },
                { status: 400 }
            );
        }

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Convert preview base64 → buffer
        const base64Data = previewImage.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        const previewFile = new File(
            [buffer],
            "preview.jpg",
            { type: "image/jpeg" }
        );

        const prompt = `
You are a professional architectural renderer.

The stone material already visible in the image is the final product.

CRITICAL RULE:
You must preserve the exact stone pattern, shapes, grout lines, and arrangement.

Do NOT:
- redesign the stone
- invent new stones
- change stone shapes
- change grout patterns
- change the texture pattern

The stone surface must remain pixel-identical.

Only improve:
• lighting
• shadows
• reflections
• global realism
• camera quality

Treat the stone material as a locked texture layer.
`;

        const result = await client.images.edit({
            model: "gpt-image-1",
            prompt,
            image: previewFile,
            size: "1024x1024",
        });

        const base64Image = result.data[0].b64_json;
        const imageBuffer = Buffer.from(base64Image, "base64");

        const date = new Date().toISOString().split("T")[0];
        const wall = slugify(wallProduct || "wall");
        const floor = slugify(floorProduct || "floor");

        const uniqueId = randomUUID();
        const fileName = `${wall}-${floor}-${date}-${uniqueId}.png`;

        // ✅ Upload AI image
        const { error: uploadError } = await supabaseAdmin.storage
            .from("renders")
            .upload(fileName, imageBuffer, {
                contentType: "image/png",
            });

        if (uploadError) throw uploadError;

        const { data } = supabaseAdmin.storage
            .from("renders")
            .getPublicUrl(fileName);

        const imageUrl = data.publicUrl;

        // ✅ FIX: Save BOTH preview + AI render
        const { error: dbError } = await supabaseAdmin
            .from("generated_renders")
            .insert({
                preview_url: previewImage,     // ✅ REQUIRED
                ai_render_url: imageUrl,       // ✅ REQUIRED
                wall_product: wallProduct || null,
                floor_product: floorProduct || null,
                created_at: new Date().toISOString()
            });

        if (dbError) throw dbError;

        return Response.json({
            aiImage: imageUrl,
            previewImage
        });

    } catch (error) {

        console.error("AI EDIT ERROR:", error);

        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
}