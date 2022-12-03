/**
 * REVIEW: Since there is no custom information, does this really need to be another class? Couldn't this be in city menu?
 */
class GuildHall {
    constructor(cityMenu) {
        // As this class has no custom options, this isn't needed.
        // jQuery.extend(true, this, /* DEFAULTGUILDHALL, */ obj);

        /** Save the city menu HTML for later replacement. */
        this.cityMenu = cityMenu;

        /** Add the swappable menu partners. */
        this.potentialPartners = [];

        /** This HTML will become the children of `#city-menu` when it is time to show the guild hall. */
        let solHTML = "";

        /* Add the guild receptionist image. */
        solHTML += `<span id='guildHallImage' class='guildHall'>Image</span>`;

        /* Add the "view quests" button. */
        /** NYI */
        solHTML += `<span id='guildHallQuests' class='cityButton guildHall'>Quests NYI</span>`;

        /* Add the "change party members" button */
        solHTML += `<span id='guildHallSwapMembers' class='cityButton guildHall'>swap members</span>`;

        /* Add the back button. */
        solHTML += `<span id='exitCity' class='cityButton guildHall'>Leave Guild Hall</span>`;

        this.menuHTML = solHTML;
    }

    /** Displays the city menu. */
    display() {
        let sv = State.variables;

        /** We should refer to `menu` instead of `this` because we have some async & changing scope stuff going on. */
        let menu = this;

        /** Add the guildhall HTML to #city-menu */
        $("#city-menu").html("");
        $("#city-menu").html(menu.menuHTML);

        /** Add the requisite event listeners to the buttons. */
        /* REVIEW: Do I want to wait for the elements to load? */

        $(`#guildHallSwapMembers`).click(function () {
            menu.displaySwap();
        });

        $(`#exitCity.guildHall`).click(function () {
            menu.back();
        });
    }

    /** Displays the pawn swap menu. */
    displaySwap() {
        let sv = State.variables;

        /** We should refer to `menu` instead of `this` because we have some async & changing scope stuff going on. */
        let menu = this;

        /** Add the guildhall HTML to #city-menu */
        $("#city-menu").html("");
        $("#city-menu").wiki("<<include Party_Preset_Select>>");
        $("#city-menu").append(`<span id='exitCity' class='cityButton swapMembers'>Back</span>`);

        /** Add the requisite event listeners to the buttons. */
        /* REVIEW: Do I want to wait for the elements to load? */
        $(`#exitCity`).click(function () {
            menu.display();
        });
    }

    /** Returns to the city menu. */
    back() {
        $("#city-menu").html("");
        this.cityMenu.display();
    }
}

// Add the required interactable functions to setup.
(function (S) {
    if (!S.map) {
        S.map = {};
    }

    // S.map.GuildHall = GuildHall;
})(setup);
