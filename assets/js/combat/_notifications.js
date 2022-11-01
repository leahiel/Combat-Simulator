/**
 * Sends a Flash notification to the location of a given character during combat.
 * 
 * https://github.com/SjoerdHekking/custom-macros-sugarcube2/tree/main/Notification
 */
function combatMessage(text, type, charLoc) {
    /* Get bounding box of character element. */
    let eleName = "";
    switch (charLoc) {
        case "enemyA":
            eleName = "combatzonegrid #gitemA";
            break;
        case "enemyB":
            eleName = "combatzonegrid #gitemB";
            break;
        case "enemyC":
            eleName = "combatzonegrid #gitemC";
            break;
        case "enemyD":
            eleName = "combatzonegrid #gitemD";
            break;
        case "enemyE":
            eleName = "combatzonegrid #gitemE";
            break;
        case "playerA":
            eleName = "playerZoneGrid #gitemA";
            break;
        case "playerB":
            eleName = "playerZoneGrid #gitemB";
            break;
        case "playerC":
            eleName = "playerZoneGrid #gitemC";
            break;
        case "playerD":
            eleName = "playerZoneGrid #gitemD";
            break;
        default:
            eleName = "combatzonegrid #gitemA";
    }

    let charPos = {
        left: $(eleName)[0].getBoundingClientRect().left,
        right: $(eleName)[0].getBoundingClientRect().right,
        top: $(eleName)[0].getBoundingClientRect().top,
        bottom: $(eleName)[0].getBoundingClientRect().bottom,
    };

    // Make sure parent container exists. 
    // Flash deletes the parent container to prevent DOM polluting, so
    // this is required.
    if ($("#flash-" + charLoc).length === 0) {
        // console.log(`Flash container does not exist.`);
        $("<div>", {
            class: "flash-container",
            id: "flash-" + charLoc,
        }).prependTo("#flash-notifs-here");
    }

    // Create the message.
    window.FlashMessage.create(text, type, {
        progress: true,
        interactive: true,
        timeout: 2000,
        appear_delay: 100,
        container: "#flash-" + charLoc,
        theme: "default",
        layout: charLoc,
        classes: {
            container: "flash-container",
            flash: "flash-message",
            visible: "flash-is-visible",
            progress: "flash-progress",
            progress_hidden: "flash-is-hidden",
        },
    });

    // Ensure the message is correctly placed.
    $("div." + charLoc + "-flash-layout").css({
        top: charPos.bottom + 20,
        left: charPos.left,
    });
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

// Add the notification functions to setup.
(function (S) {
    if (!S.fns) {
        S.fns = {};
    }

    S.fns.combatMessage = function (text, type, charLoc) {
        combatMessage(text, type, charLoc);
    };
})(setup);
