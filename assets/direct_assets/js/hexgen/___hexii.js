// TODO: Make a macro that reads the title of every .svg in this 
// folder, and determines if they should be renamed to fit convetions.

// TODO: Add weights to each hex.

// TODO: Note if hex has special thing. "Village", "Cave Entrance", etc.

/**
 * These are all the base objects of our hexii. Literally, they're the
 * data that matches the images used in the hexagons.
 *
 * Hexagon edges are laid out like this:
 *
 *            0 1
 *           5 ⬡ 2
 *            4 3
 */
// REVIEW: Is it wise to have a field named `default`?
let HEXII = [
    {
        name: "PPPPPP-1",
        src: "assets/imported/img/svg/hex/PPPPPP-1.svg",
        version: 0,
        edgelines: {
            default: ["plains", "plains", "plains", "plains", "plains", "plains"],
            rOnce: ["plains", "plains", "plains", "plains", "plains", "plains"],
            rTwice: ["plains", "plains", "plains", "plains", "plains", "plains"],
            rThrice: ["plains", "plains", "plains", "plains", "plains", "plains"],
            rQuarce: ["plains", "plains", "plains", "plains", "plains", "plains"],
            rQuince: ["plains", "plains", "plains", "plains", "plains", "plains"],
            inverted: ["plains", "plains", "plains", "plains", "plains", "plains"],
            irOnce: ["plains", "plains", "plains", "plains", "plains", "plains"],
            irTwice: ["plains", "plains", "plains", "plains", "plains", "plains"],
            irThrice: ["plains", "plains", "plains", "plains", "plains", "plains"],
            irQuarce: ["plains", "plains", "plains", "plains", "plains", "plains"],
            irQuince: ["plains", "plains", "plains", "plains", "plains", "plains"],
        },
    },
    {
        name: "RPPPPP-1",
        src: "assets/imported/img/svg/hex/RPPPPP-1.svg",
        version: 0,
        edgelines: {
            default: ["road", "plains", "plains", "plains", "plains", "plains"],
            rOnce: ["plains", "road", "plains", "plains", "plains", "plains"],
            rTwice: ["plains", "plains", "road", "plains", "plains", "plains"],
            rThrice: ["plains", "plains", "plains", "road", "plains", "plains"],
            rQuarce: ["plains", "plains", "plains", "plains", "road", "plains"],
            rQuince: ["plains", "plains", "plains", "plains", "plains", "road"],
            inverted: ["plains", "road", "plains", "plains", "plains", "plains"],
            irOnce: ["plains", "plains", "road", "plains", "plains", "plains"],
            irTwice: ["plains", "plains", "plains", "road", "plains", "plains"],
            irThrice: ["plains", "plains", "plains", "plains", "road", "plains"],
            irQuarce: ["plains", "plains", "plains", "plains", "plains", "road"],
            irQuince: ["road", "plains", "plains", "plains", "plains", "plains"],
        },
    },
    {
        name: "RPPPPP-2",
        src: "assets/imported/img/svg/hex/RPPPPP-2.svg",
        version: 0,
        edgelines: {
            default: ["road", "plains", "plains", "plains", "plains", "plains"],
            rOnce: ["plains", "road", "plains", "plains", "plains", "plains"],
            rTwice: ["plains", "plains", "road", "plains", "plains", "plains"],
            rThrice: ["plains", "plains", "plains", "road", "plains", "plains"],
            rQuarce: ["plains", "plains", "plains", "plains", "road", "plains"],
            rQuince: ["plains", "plains", "plains", "plains", "plains", "road"],
            inverted: ["plains", "road", "plains", "plains", "plains", "plains"],
            irOnce: ["plains", "plains", "road", "plains", "plains", "plains"],
            irTwice: ["plains", "plains", "plains", "road", "plains", "plains"],
            irThrice: ["plains", "plains", "plains", "plains", "road", "plains"],
            irQuarce: ["plains", "plains", "plains", "plains", "plains", "road"],
            irQuince: ["road", "plains", "plains", "plains", "plains", "plains"],
        },
    },
    {
        name: "RRPPPP-1",
        src: "assets/imported/img/svg/hex/RRPPPP-1.svg",
        version: 0,
        edgelines: {
            default: ["road", "roads", "plains", "plains", "plains", "plains"],
            rOnce: ["plains", "road", "roads", "plains", "plains", "plains"], 
            rTwice: ["plains", "plains", "road", "roads", "plains", "plains"], 
            rThrice: ["plains", "plains", "plains", "road", "roads", "plains"], 
            rQuarce: ["plains", "plains", "plains", "plains", "road", "roads"], 
            rQuince: ["roads", "plains", "plains", "plains", "plains", "road"], 
            inverted: ["roads", "road", "plains", "plains", "plains", "plains"], 
            irOnce: ["plains", "roads", "road", "plains", "plains", "plains"], 
            irTwice: ["plains", "plains", "roads", "road", "plains", "plains"], 
            irThrice: ["plains", "plains", "plains", "roads", "road", "plains"], 
            irQuarce: ["plains", "plains", "plains", "plains", "roads", "road"], 
            irQuince: ["road", "plains", "plains", "plains", "plains", "roads"],
        },
    },
    {
        name: "RRPPPP-2",
        src: "assets/imported/img/svg/hex/RRPPPP-2.svg",
        version: 0,
        edgelines: {
            default: ["road", "roads", "plains", "plains", "plains", "plains"],
            rOnce: ["plains", "road", "roads", "plains", "plains", "plains"], 
            rTwice: ["plains", "plains", "road", "roads", "plains", "plains"], 
            rThrice: ["plains", "plains", "plains", "road", "roads", "plains"], 
            rQuarce: ["plains", "plains", "plains", "plains", "road", "roads"], 
            rQuince: ["roads", "plains", "plains", "plains", "plains", "road"], 
            inverted: ["roads", "road", "plains", "plains", "plains", "plains"], 
            irOnce: ["plains", "roads", "road", "plains", "plains", "plains"], 
            irTwice: ["plains", "plains", "roads", "road", "plains", "plains"], 
            irThrice: ["plains", "plains", "plains", "roads", "road", "plains"], 
            irQuarce: ["plains", "plains", "plains", "plains", "roads", "road"], 
            irQuince: ["road", "plains", "plains", "plains", "plains", "roads"],
        },
    },
    {
        name: "RPRPPP-1",
        src: "assets/imported/img/svg/hex/RPRPPP-1.svg",
        version: 0,
        edgelines: {
            default: ["road", "plains", "road", "plains", "plains", "plains"],
            rOnce: ["plains", "road", "plains", "road", "plains", "plains"],
            rTwice: ["plains", "plains", "road", "plains", "road", "plains"],
            rThrice: ["plains", "plains", "plains", "road", "plains", "road"],
            rQuarce: ["road", "plains", "plains", "plains", "road", "plains"],
            rQuince: ["plains", "road", "plains", "plains", "plains", "road"],
            inverted: ["plains", "road", "plains", "plains", "plains", "road"],
            irOnce: ["road", "plains", "road", "plains", "plains", "plains"],
            irTwice: ["plains", "road", "plains", "road", "plains", "plains"],
            irThrice: ["plains", "plains", "road", "plains", "road", "plains"],
            irQuarce: ["plains", "plains", "plains", "road", "plains", "road"],
            irQuince: ["road", "plains", "plains", "plains", "road", "plains"],
        },
    },
    {
        name: "RPRPPP-2",
        src: "assets/imported/img/svg/hex/RPRPPP-2.svg",
        version: 0,
        edgelines: {
            default: ["road", "plains", "road", "plains", "plains", "plains"],
            rOnce: ["plains", "road", "plains", "road", "plains", "plains"],
            rTwice: ["plains", "plains", "road", "plains", "road", "plains"],
            rThrice: ["plains", "plains", "plains", "road", "plains", "road"],
            rQuarce: ["road", "plains", "plains", "plains", "road", "plains"],
            rQuince: ["plains", "road", "plains", "plains", "plains", "road"],
            inverted: ["plains", "road", "plains", "plains", "plains", "road"],
            irOnce: ["road", "plains", "road", "plains", "plains", "plains"],
            irTwice: ["plains", "road", "plains", "road", "plains", "plains"],
            irThrice: ["plains", "plains", "road", "plains", "road", "plains"],
            irQuarce: ["plains", "plains", "plains", "road", "plains", "road"],
            irQuince: ["road", "plains", "plains", "plains", "road", "plains"],
        },
    },
    {
        name: "RPPRPP-1",
        src: "assets/imported/img/svg/hex/RPPRPP-1.svg",
        version: 0,
        edgelines: {
            default: ["road", "plains", "plains", "road", "plains", "plains"],
            rOnce: ["plains", "road", "plains", "plains", "road", "plains"], 
            rTwice: ["plains", "plains", "road", "plains", "plains", "road"], 
            rThrice: ["road", "plains", "plains", "road", "plains", "plains"], 
            rQuarce: ["plains", "road", "plains", "plains", "road", "plains"], 
            rQuince: ["plains", "plains", "road", "plains", "plains", "road"], 
            inverted: ["plains", "road", "plains", "plains", "road", "plains"], 
            irOnce: ["plains", "plains", "road", "plains", "plains", "road"], 
            irTwice: ["road", "plains", "plains", "road", "plains", "plains"], 
            irThrice: ["plains", "road", "plains", "plains", "road", "plains"], 
            irQuarce: ["plains", "plains", "road", "plains", "plains", "road"], 
            irQuince: ["road", "plains", "plains", "road", "plains", "plains"],
        },
    },
    {
        name: "RPRRPP-1",
        src: "assets/imported/img/svg/hex/RPRRPP-1.svg",
        version: 0,
        edgelines: {
            default: ["road", "plains", "road", "road", "plains", "plains"],
            rOnce: ["plains", "road", "plains", "road", "road", "plains"],
            rTwice: ["plains", "plains", "road", "plains", "road", "road"],
            rThrice: ["road", "plains", "plains", "road", "plains", "road"],
            rQuarce: ["road", "road", "plains", "plains", "road", "plains"],
            rQuince: ["plains", "road", "road", "plains", "plains", "road"],
            inverted: ["plains", "road", "plains", "plains", "road", "road"],
            irOnce: ["road", "plains", "road", "plains", "plains", "road"],
            irTwice: ["road", "road", "plains", "road", "plains", "plains"],
            irThrice: ["plains", "road", "road", "plains", "road", "plains"],
            irQuarce: ["plains", "plains", "road", "road", "plains", "road"],
            irQuince: ["road", "plains", "plains", "road", "road", "plains"],
        },
    },
    // {
    //     name: "RIIPRP-1",
    //     src: "assets/imported/img/svg/hex/RIIPRP-1.svg",
    //     version: 0,
    //     edgelines: {
    //         default: ["road", "river", "river", "plains", "road", "plains"],
    //         rOnce: ["plains", "road", "river", "river", "plains", "road"],
    //         rTwice: ["road", "plains", "road", "river", "river", "plains"],
    //         rThrice: ["plains", "road", "plains", "road", "river", "river"],
    //         rQuarce: ["river", "plains", "road", "plains", "road", "river"],
    //         rQuince: ["river", "river", "plains", "road", "plains", "road"],
    //         inverted: ["river", "road", "plains", "road", "plains", "river"],
    //         irOnce: ["river", "river", "road", "plains", "road", "plains"],
    //         irTwice: ["plains", "river", "river", "road", "plains", "road"],
    //         irThrice: ["road", "plains", "river", "river", "road", "plains"],
    //         irQuarce: ["plains", "road", "plains", "river", "river", "road"],
    //         irQuince: ["road", "plains", "road", "plains", "river", "river"],
    //     },
    // },
];

(function (S) {
    if (!S.hex) {
        S.hex = {};
    }

    S.hex.HEXII = HEXII;
})(setup);
