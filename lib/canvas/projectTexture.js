export function projectTexture(ctx, img, quad) {

    const [p0, p1, p2, p3] = quad;

    const w = img.width;
    const h = img.height;

    const step = 2; // sampling resolution

    for (let y = 0; y < h; y += step) {

        const v = y / h;

        const leftX = p0[0] + (p3[0] - p0[0]) * v;
        const leftY = p0[1] + (p3[1] - p0[1]) * v;

        const rightX = p1[0] + (p2[0] - p1[0]) * v;
        const rightY = p1[1] + (p2[1] - p1[1]) * v;

        const rowWidth = rightX - leftX;

        ctx.drawImage(
            img,
            0,
            y,
            w,
            step,
            leftX,
            leftY,
            rowWidth,
            step
        );
    }
}