import OpenAI from "openai";

export async function GET() {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: "a white marble stone wall texture",
      size: "1024x1024",
    });

    return Response.json({
      success: true,
      image: result.data[0].url,
    });

  } catch (error) {
    console.error("ERROR:", error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}