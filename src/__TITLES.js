// LINK: assets\js\_setup.js#TITLES
let version = "0.1.0 InDev";

// Chapter Title Names
let TITLES = {
    "@start": "Create Your Character",
    "@combatoverlord": "Fight!",
    "@rest": "Rest for a Bit, Weary Fighter",
};

let bottomUIStr = `<span style="color:brown">This game is currently in InDev development.</span>
<br>
You're playing <span style="text-decoration:underline">${Story.title}</span>, Version <span style="color:lightblue">${version}</span>, by <a href="https://leahiel.itch.io/" target="_blank" rel="noreferrer noopener">LeahPeach↗</a>
<br>
Find my other games at <a href="https://leahiel.itch.io/" target="_blank" rel="noreferrer noopener">Itch.io</a>. Feel free to follow me if you'd like to be notified of my future games as well!`;

// Add the strings to setup.
// REVIEW: Is this really needed? Do I need to make these a part of
// setup when this file isn't in assets/js/?
(function (S) {
    if (!S.STR) {
        S.STR = {};
    }

    S.STR.TITLES = TITLES;
    S.STR.version = version;
    S.STR.bottomUIStr = bottomUIStr;
})(setup);
