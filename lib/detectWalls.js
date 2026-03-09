export function detectWalls(img) {

    const width = img.width;
    const height = img.height;

    const horizon = height * 0.6;

    return {

        backWall: [
            [width * 0.22, 0],
            [width * 0.85, 0],
            [width * 0.95, horizon],
            [width * 0.12, horizon]
        ],

        leftWall: [
            [0, 0],
            [width * 0.22, 0],
            [width * 0.12, horizon],
            [0, horizon]
        ],

        floor: [
            [0, horizon],
            [width, horizon],
            [width * 1.2, height],
            [width * -0.2, height]
        ]

    };

}