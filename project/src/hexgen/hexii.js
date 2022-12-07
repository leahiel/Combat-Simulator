/***
 * These are all the base objects of our hexii. Literally, they're the data that matches the images used in the hexagons.
 *
 * Of note, hexagon edgelines are laid out like this:
 *
 *              1       2
 *
 *          6      hex       3
 *
 *              5       4
 */

let hexii = [
    {
        src: "project/src/hexgen/heximg/ph_1.png",
        version: 0,
        edgelines: {
            default: ["forest", "forest", "plains", "lake", "lake", "road"],
            rOnce: ["forest", "plains", "lake", "lake", "road", "forest"],
            rTwice: ["plains", "lake", "lake", "road", "forest", "forest"],
            rThrice: ["lake", "lake", "road", "forest", "forest", "plains"],
            rQuarce: ["lake", "road", "forest", "forest", "plains", "lake"],
            rQuince: ["road", "forest", "forest", "plains", "lake", "lake"],
            inverted: ["road", "lake", "lake", "plains", "forest", "forest"],
            irOnce: ["lake", "lake", "plains", "forest", "forest", "road"],
            irTwice: ["lake", "plains", "forest", "forest", "road", "lake"],
            irThrice: ["plains", "forest", "forest", "road", "lake", "lake"],
            irQuarce: ["forest", "forest", "road", "lake", "lake", "plains"],
            irQuince: ["forest", "road", "lake", "lake", "plains", "forest"],
        },
    },
];

(function (S) {
    if (!S.hex) {
        S.hex = {};
    }

    S.hex.hexii = hexii;
})(setup);
