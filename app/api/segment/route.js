export async function POST(req) {
    try {
        const body = await req.json();
        const { image } = body;

        // For now just return the same image as a mask
        // (white = wall everywhere)

        return Response.json({
            mask: image
        });

    } catch (error) {

        console.error("SEGMENT ERROR:", error);

        return Response.json(
            { error: "Segmentation failed" },
            { status: 500 }
        );

    }
}