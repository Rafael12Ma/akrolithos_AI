import OpenAI from "openai";

export async function POST(req) {
    try {
        const { roomImage, stoneImage } = await req.json();

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            defaultHeaders: {
                "OpenAI-Version": "2024-02-15-preview"   // 🔥 THIS FIXES IT
            }
        });

        const response = await client.responses.create({
            model: "gpt-image-1",
            input: [
                {
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: `
Replace ONLY the wall surfaces in the first image with the stone texture shown in the second image.
Do NOT modify floor, ceiling, furniture or lighting.
Keep realism and perspective accurate.
`
                        },
                        {
                            type: "input_image",
                            image_url: roomImage
                        },
                        {
                            type: "input_image",
                            image_url: stoneImage
                        }
                    ]
                }
            ]
        });

        const imageBase64 =
            response.output[0].content.find(
                (item) => item.type === "output_image"
            ).image_base64;

        return Response.json({ image: imageBase64 });

    } catch (error) {
        console.error("AI EDIT ERROR:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}