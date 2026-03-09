import MagicWand from "magic-wand-tool";

export function createWallMask(canvas, x, y) {

    const ctx = canvas.getContext("2d");
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const mask = MagicWand.floodFill(
        img,
        x,
        y,
        15,     // color tolerance
        null,
        true
    );

    return mask;
}