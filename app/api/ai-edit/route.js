import OpenAI from "openai";
import sharp from "sharp";

export const runtime = "nodejs";

function base64ToFile(base64, filename) {
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    return new File([buffer], filename, { type: "image/jpeg" });
}

async function cropStoneTexture(url) {
    const res = await fetch(url);
    const buffer = Buffer.from(await res.arrayBuffer());

    return new File([buffer], "stone.jpg", { type: "image/jpeg" });
}

export async function POST(req) {
    try {
        const body = await req.json();

        const { roomImage, wallImage, floorImage } = body;

        console.log("roomImage exists:", !!roomImage);
        console.log("wallImage exists:", !!wallImage);
        console.log("floorImage exists:", !!floorImage);

        const stoneImage = wallImage || floorImage;

        if (!roomImage || !stoneImage) {
            return Response.json(
                { error: "Missing roomImage or stoneImage" },
                { status: 400 }
            );
        }

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const roomBuffer = Buffer.from(
            roomImage.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
        );

        const resized = await sharp(roomBuffer)
            .resize(1024)
            .jpeg({ quality: 85 })
            .toBuffer();

        const roomFile = new File([resized], "room.jpg", {
            type: "image/jpeg",
        });
        const stoneFile = await cropStoneTexture(stoneImage);

        const prompt = `
You are a professional architectural renderer.

The first image is a room interior.
The second image is a stone wall material.

Apply the stone material naturally to the vertical walls of the room.

1. detect wall
2. tile stone texture
3. perspective warp
4. AI adjusts lighting and shadows to match the original room photo

Rules:
- Only modify wall surfaces
- Keep floor, windows, furniture and ceiling unchanged
- Preserve original lighting and shadows
- Maintain perspective and geometry of the room
- Use realistic masonry scale
- Do not stretch the material
- Result must look like a real photograph of a stone wall installation
`;

        const result = await client.images.edit({
            model: "gpt-image-1",
            prompt,
            image: [roomFile, stoneFile],
            size: "1024x1024",
        });

        return Response.json({
            image: result.data[0].b64_json,
        });

    } catch (error) {
        console.error("AI EDIT ERROR:", error);

        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
}