import OpenAI from "openai";

export const runtime = "nodejs";

function stripBase64(dataUrl) {
    return dataUrl.replace(/^data:image\/\w+;base64,/, "");
}

export async function POST(req) {
    try {
        const { roomImage, stoneImage } = await req.json();

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = `
Replace ONLY the wall surfaces in the first image with the stone texture from the second image.
Preserve floor, ceiling, furniture, lighting, shadows and perspective exactly.
Maintain photorealism.
`;

        const result = await client.images.generate({
            model: "gpt-image-1",
            prompt,
            images: [
                stripBase64(roomImage),
                stripBase64(stoneImage),
            ],
            size: "1024x1024"
        });
        console.log('result=', result)
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

// 

// My organization is still routing image requests through OpenAI-Version 2020-10-01.

// I am trying to use gpt-image-1 with multiple input images (image editing),
// but the API rejects the "images" parameter and returns:
// Unknown parameter: 'images'

// Please migrate my organization/project to the latest API version
// so I can use the current multimodal image editing endpoint.
// Project ID: proj_HP14jfsjJUZBnV0BzF5gAY4f
// Organization ID: org-u5Dsb3uMfP2DiVIqQpHepZcg
