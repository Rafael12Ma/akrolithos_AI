import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/SupabaseAdmin";

export const runtime = "nodejs";

export async function POST(req) {
    try {

        const body = await req.json();
        const { previewImage } = body;

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

        // Convert preview base64 → file
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
- Do not change the stone texture
- Do not change geometry
- Do not change objects or layout
- Only improve realism and lighting

The result must look like a professional architectural photograph.
`;

        const result = await client.images.edit({
            model: "gpt-image-1",
            prompt,
            image: previewFile,
            size: "1024x1024",
        });

        const base64Image = result.data[0].b64_json;

        // Convert AI result → buffer
        const imageBuffer = Buffer.from(base64Image, "base64");

        const fileName = `render-${Date.now()}.png`;

        // Upload render to Supabase Storage
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

        // Save render in database
        await supabaseAdmin
            .from("generated_renders")
            .insert({
                image_url: imageUrl
            });

        return Response.json({
            image: imageUrl,
        });

    } catch (error) {

        console.error("AI EDIT ERROR:", error);

        return Response.json(
            { error: error.message },
            { status: 500 }
        );

    }
}