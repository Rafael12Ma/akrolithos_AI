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

        console.log("previewImage exists:", !!previewImage);

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

The image is a preview of a room where stone textures have already been applied.

Improve the realism of the render.

Enhance:
- natural lighting
- material realism
- shadows
- depth
- reflections

Rules:
The stone material already applied in the image is the exact product texture.

You must preserve the exact stone pattern, shape, and arrangement.

Do not redesign or reinterpret the stone.

Only enhance lighting, shadows, and photographic realism.

Do not change geometry.
Do not change objects or layout.

The stone material visible in the image is final.

Do NOT replace or redesign the stone.

Preserve the exact texture pattern.

Only improve lighting, shadows, and realism.

The result must look like a professional architectural photograph.
`;

        const result = await client.images.edit({
            model: "gpt-image-1",
            prompt,
            image: previewFile,
            size: "1024x1024",
        });

        const base64Image = result.data[0].b64_json;

        // Convert AI image → buffer
        const imageBuffer = Buffer.from(base64Image, "base64");

        const date = new Date().toISOString().split("T")[0];

        const wall = slugify(wallProduct || "wall");
        const floor = slugify(floorProduct || "floor");

        // UNIQUE FILE NAME
        const uniqueId = randomUUID();

        const fileName = `${wall}-${floor}-${date}-${uniqueId}.png`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabaseAdmin.storage
            .from("renders")
            .upload(fileName, imageBuffer, {
                contentType: "image/png",
            });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabaseAdmin.storage
            .from("renders")
            .getPublicUrl(fileName);

        const imageUrl = data.publicUrl;

        // Save in database
        await supabaseAdmin
            .from("generated_renders")
            .insert({
                image_url: imageUrl
            });

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