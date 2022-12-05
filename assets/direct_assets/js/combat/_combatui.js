/**
 * Determine which characters should have their Canvas information
 * updated.
 *
 * If so, update their canvas.
 */
function determineIfCanvas(char) {
    if (char) {
        $(`#gittem${char.location.slice(-1)} progress.healthBar`).attr({
            value: char.health,
            max: char.healthMax,
        });
        updateCanvas(char, $(`canvas.initBar#${char.location}`));
    }
}

/**
 * Determine which characters should have their Canvas information
 * updated.
 *
 * Redraw ::Player_Attacks.
 */
function drawCombat() {
    /**
     * We reprocess this so that if it is the player's turn, they can
     * make an attack. Or alternatively, if it is not their turn,
     * their attack icons are disabled.
     */
    $("#playerAttacks").empty().wiki(Story.get("Player_Attacks").processText());

    for (let char of State.variables.ci.ep) {
        determineIfCanvas(char);
    }

    for (let char of State.variables.ci.pp) {
        determineIfCanvas(char);
    }
}

/**
 * Generate and send a Flash notification to the location of a given single character during combat.
 *
 * The attackPackage contains specific information about the attack on its target. Specifically:
 *  attackPackage.damage === n.nnnn
 *  attackPackage.blocked === bool
 *  attackPackage.critical === bool
 *  attackPackage.deflected === bool
 *  attackPackage.direct === bool
 *
 * https://github.com/SjoerdHekking/custom-macros-sugarcube2/tree/main/Notification
 */
// function combatMessage(text, type, charLoc) {
function combatMessage(attack, char, attackPackage) {
    /** Combat messages always have the same Flash `Type`: "default" */
    let type = "default";

    /* Get bounding box of character element. */
    let eleName;
    if (char.location.includes("enemy")) {
        eleName = `#enemyZone #gitem${char.location.charAt(char.location.length - 1)}`;
    } else if (char.location.includes("player")) {
        eleName = `#playerZone #gitem${char.location.charAt(char.location.length - 1)}`;
    }

    let charPos = {
        left: $(eleName)[0].getBoundingClientRect().left,
        right: $(eleName)[0].getBoundingClientRect().right,
        top: $(eleName)[0].getBoundingClientRect().top,
        bottom: $(eleName)[0].getBoundingClientRect().bottom,
    };

    /**
     * Ensure parent container exists.
     * Flash deletes the parent container to prevent DOM polluting, so
     * this is required.
     */
    if ($("#flash-" + char.location).length === 0) {
        $("<div>", {
            class: "flash-container",
            id: "flash-" + char.location,
        }).prependTo("#flash-notifs-here");
    }

    // Ensure the message is correctly placed.
    // NOTE: If we $appendTo(), it just gets deleted when the elements are refreshed.
    let gitemWidth = (charPos.right - charPos.left) / 2;
    let gitemHeight = (charPos.bottom - charPos.top) / 2;

    let randomHorizontalPos = Math.floor(Math.random() * (gitemWidth - 0 + 1) + 0) + gitemWidth / 2;
    let randomVerticalPos = Math.floor(Math.random() * (gitemHeight - 0 + 1) + 0) + gitemHeight / 4;

    // Create and place the damage message.
    if (attackPackage.damage > 0) {
        let theme = "damage";
        if (attackPackage.critical) {
            theme = "critical";
        } else if (attackPackage.direct) {
            theme = "direct";
        }

        let message = window.FlashMessage.create(Math.round(attackPackage.damage), type, {
            progress: false,
            interactive: false,
            timeout: 2000,
            appear_delay: 50,
            container: "#flash-" + char.location, // This is the container for ALL flash notifications for this character.
            /**
             * Theme becomes a class with name: `${theme}-theme`, so theme: "damage" becomes "damage-theme".
             * So we want to edit ".flash-message.default-theme"
             */
            theme: theme,
            layout: char.location,
            classes: {
                container: "flash-container",
                flash: "flash-message",
                visible: "flash-is-visible",
                progress: "flash-progress",
                progress_hidden: "flash-is-hidden",
            },
        });
        let messageId = $(message["$_element"]).attr("id");

        $(`#${messageId}`)
            .css({
                left: charPos.left + randomHorizontalPos,
                top: charPos.bottom + randomVerticalPos,
            })
            .animate(
                {
                    top: charPos.bottom + randomVerticalPos / 2,
                },
                2000
            );
    }

    // Create and place the block message.
    if (attackPackage.blocked) {
        let message = window.FlashMessage.create("Blocked", type, {
            progress: false,
            interactive: false,
            timeout: 2000,
            appear_delay: 50,
            container: "#flash-" + char.location, // This is the container for ALL flash notifications for this character.
            /**
             * Theme becomes a class with name: `${theme}-theme`, so theme: "damage" becomes "damage-theme".
             * So we want to edit ".flash-message.default-theme"
             */
            theme: "block",
            layout: char.location,
            classes: {
                container: "flash-container",
                flash: "flash-message",
                visible: "flash-is-visible",
                progress: "flash-progress",
                progress_hidden: "flash-is-hidden",
            },
        });
        let messageId = $(message["$_element"]).attr("id");

        $(`#${messageId}`).css({
            left: charPos.right - gitemWidth / 3,
            top: charPos.bottom + gitemHeight,
        });
    }

    // Create and place the deflect message.
    if (attackPackage.deflect) {
        let message = window.FlashMessage.create("Deflected", type, {
            progress: false,
            interactive: false,
            timeout: 2000,
            appear_delay: 50,
            container: "#flash-" + char.location, // This is the container for ALL flash notifications for this character.
            /**
             * Theme becomes a class with name: `${theme}-theme`, so theme: "damage" becomes "damage-theme".
             * So we want to edit ".flash-message.default-theme"
             */
            theme: "deflect",
            layout: char.location,
            classes: {
                container: "flash-container",
                flash: "flash-message",
                visible: "flash-is-visible",
                progress: "flash-progress",
                progress_hidden: "flash-is-hidden",
            },
        });
        let messageId = $(message["$_element"]).attr("id");

        $(`#${messageId}`).css({
            left: charPos.right - gitemWidth / 3,
            top: charPos.bottom + gitemHeight,
        });
    }
}

/** Updates the #playerAttacks, which is in #targetsZone. */
function updatePlayerAttacks(className) {
    // Empty and remove all classes.
    $(`#targetsZone #playerAttacks`).empty().removeClass();
    if (className) {
        $(`#targetsZone #playerAttacks`).addClass(className);
    }
}

/**
 * Update the Canvas information of the given entity.
 */
function updateCanvas(char, canvasElement) {
    /**
     * jCanvas library documentation:
     * https://projects.calebevans.me/jcanvas/docs/
     */
    canvasElement.clearCanvas();

    /* The left most starting position of the initbar line. */
    let horiBarXPos = 432;
    let hpBarXPos = horiBarXPos + 220;

    /** HP Bar */
    // "HP:" Text
    canvasElement.drawText({
        fillStyle: "#FFFFFF",
        fontSize: 80,
        strokeWidth: 5,
        strokeStyle: "#FFFFFF",
        text: "HP:",
        x: hpBarXPos - 160,
        y: 78,
    });

    // Outline
    canvasElement.drawLine({
        strokeStyle: "#000000",
        strokeWidth: 80,
        rounded: true,
        x1: hpBarXPos - 20,
        y1: 78,
        x2: 2000,
        y2: 78,
    });
    // Background
    canvasElement.drawLine({
        strokeStyle: "#8C99A6",
        strokeWidth: 60,
        rounded: true,
        x1: hpBarXPos,
        y1: 78,
        x2: 1980,
        y2: 78,
    });
    // Actual Heath Bar
    if (char.health > 0) {
        canvasElement.drawLine({
            strokeStyle: "#AA0000",
            strokeWidth: 60,
            rounded: true,
            x1: hpBarXPos,
            y1: 78,
            x2: Math.max((char.health / char.healthMax) * (1980 - hpBarXPos) + hpBarXPos, hpBarXPos),
            y2: 78,
        });
    }

    /** Init Bar */
    // The rhombus.
    let rhombusimg = "";
    let linecolor = "";
    if (char.location.includes("player") && char.init <= 0) {
        /* Green rhombus and line. */
        rhombusimg = "assets/imported/img/png/turn_icon_pl.png";
        linecolor = "#2EFF23";
    } else if (char.location.includes("enemy") && char.init <= 0) {
        /* Red rhombus and line. */
        rhombusimg = "assets/imported/img/png/turn_icon_en.png";
        linecolor = "#FF0000";
    } else {
        /* Yellow rhombus and line. */
        rhombusimg = "assets/imported/img/png/turn_icon.png";
        linecolor = "#FFFF00";
    }
    canvasElement.drawImage({
        source: rhombusimg,
        x: 192,
        y: 192,
        width: 384,
        height: 384,
    });

    // The horizontal line.
    canvasElement.drawLine({
        strokeStyle: linecolor,
        strokeWidth: 10,
        rounded: true,
        x1: horiBarXPos,
        y1: 256,
        x2: 1700,
        y2: 256,
    });

    // The Init Amount at the end of the horizontal line.
    canvasElement.drawText({
        fillStyle: "#FFFFFF",
        fontSize: 120,
        strokeWidth: 5,
        strokeStyle: "#FFFFFF",
        text: Math.ceil(char.init),
        x: 1850,
        y: 256,
    });

    // Init indicator.
    if (char.health > 0) {
        let xpos = Math.min(char.init * 16 + horiBarXPos, 1700);
        let iconimg = "";
        if (char.location.includes("player")) {
            /* Green indicator. */
            iconimg = "assets/imported/img/png/init_icon_pl.png";
        } else if (char.location.includes("enemy")) {
            /* Red indicator. */
            iconimg = "assets/imported/img/png/init_icon_en.png";
        }

        canvasElement.drawImage({
            source: iconimg,
            x: xpos,
            y: 320,
            width: 72,
            height: 88,
        });
    }

    /**
     * Buff Indicators.
     */
    if (char.buffs.length > 0) {
        for (let buff of char.buffs) {
            let xpos = Math.min(buff.duration * 6 + horiBarXPos, 1700);
            let iconimg = "";
            if (buff.type === "buff") {
                /* Green indicator. */
                iconimg = "assets/imported/img/png/turn_icon_pl.png";
            } else if (buff.type === "debuff") {
                /* Red indicator. */
                iconimg = "assets/imported/img/png/turn_icon_en.png";
            }

            canvasElement.drawImage({
                source: iconimg,
                x: xpos,
                y: 220,
                width: 80,
                height: 80,
            });
        }
    }
}

/**
 * TODO: A handler function that should be called whenever the screen
 * is manipulated (resized, window boundries move, phone switches to
 * landscape/portrait, etc) that replaces the charLoc notif placements
 * into a correct place.
 *
 * Also gotta make the location (in combat.tw ?) that calls this
 * proposed handler.
 */

/**
 * Displays information about the obj when the selector element is
 * mouseover'd.
 *
 * The `obj` must have a `.getInfo()` method.
 *
 * TODO: This should be called while hovering, not on mouseover.
 * That is, 100% of the time this function is called, I want it to call while object is hovering, so it is called repeatedly at a decent interval.
 */
function displayToInfoScreenOnMouseover(selector, obj, obj2) {
    waitForElm(selector).then((elm) => {
        $(elm).mouseenter(function () {
            // If state is combat
            if (Story.get(passage()).tags.includes(".combat")) {
                $("#MainCombatGrid #combatNotifications").html(obj.getInfo(obj2));
            } else {
                $("#attackInfoDescription").html(obj.getInfo(obj2));
            }
        });
    });
}

// Add the notification functions to setup.
(function (S) {
    if (!S.fns) {
        S.fns = {};
    }

    S.fns.displayToInfoScreenOnMouseover = function (selector, obj, attackPackage) {
        displayToInfoScreenOnMouseover(selector, obj, attackPackage);
    };

    // S.fns.combatMessage = function (text, type, charLoc) {
    //     combatMessage(text, type, charLoc);
    // };

    if (!S.COM) {
        S.COM = {};
    }

    S.COM.determineIfCanvas = function (char) {
        determineIfCanvas(char);
    };

    S.COM.drawCombat = function () {
        drawCombat();
    };

    S.COM.updatePlayerAttacks = function (className) {
        updatePlayerAttacks(className);
    };
})(setup);
