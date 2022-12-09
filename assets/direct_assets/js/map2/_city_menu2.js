let DEFAULTCITYMENU = {
    name: "Unknown City",
    generateCity: true,

    /* buildings */
    hasGuildHall: false,
    hasInn: true,
    innHandler: function (menu) {
        new setup.tb.TextBox(setup.tbs.inn_tbs.random());

        $(document).one(":textboxclosed", function () {
            let inn = new Inn(menu);
            inn.display();
        });
    },
    hasShop: false,
    hasBazaar: false,
    hasGatherInfo: true,
    gatherInfoHandler: function (menu, uuid) {
        // TODO: Use menu.timesVisited and uuid to make an array of gatherinfo_tbs and progress through it.
        new setup.tb.TextBox(setup.tbs.gatherinfo_tbs[0]);
    },
    hasTavern: true,
    tavernHandler: function (menu, uuid) {
        // TODO: Use menu.timesVisited and uuid to make an array of gatherinfo_tbs and progress through it.
        new setup.tb.TextBox(setup.tbs.tavern_tbs[0]);
    },
    hasCrafting: false, // Unused
    craftingType: "none", // "None", "Jewelcrafter", "Blacksmith", "Leatherworker", "Tailor", "Shrine", "Alchemist"
};

/**
 *
 */
class CityMenu {
    constructor(obj) {
        if (!State.variables.quest.citiesMade) {
            State.variables.quest.citiesMade = 0;
        } else {
            State.variables.quest.citiesMade += 1;
        }
        
        if (obj.generateCity) {
            // TODO Use sv.uuid to deterministically generate city, if desired, before merging everyhing onto `this`.
            // Also use the integer State.variables.quest.citiesMade so we don't make duplicate cities.
        }

        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, DEFAULTCITYMENU, obj);

        this.shortenedName = this.name
            .replace(/^(.{1,10}[^\s]*).*/, "$1")
            .replace(/\s+/g, "")
            .toLowerCase();

        if (this.shortenedName === "unknowncity") {
            console.error("City lacks a name.");
        }

        /** This HTML will become the children of `#city-menu` when it is time to show the menu. */
        let solHTML = "";

        /* Add the city img. */
        solHTML += `<span id='cityImage'>IMAGE</span>`;

        /* Add the city name. */
        solHTML += `<span id='cityName'>${this.name}</span>`;

        /* Add the buildings. */

        if (this.hasGuildHall) {
            solHTML += `<span id='cityGuildHall' class='cityButton'>Guild Hall</span>`;
        } else {
            solHTML += `<span id='cityGuildHall' class='noBuilding'></span>`;
        }

        if (this.hasInn) {
            solHTML += `<span id='cityInn' class='cityButton'>Inn</span>`;
        } else {
            solHTML += `<span id='cityInn' class='noBuilding'></span>`;
        }

        /** NYI */
        this.hasShop = false;
        if (this.hasShop) {
            solHTML += `<span id='cityShop' class='cityButton'>Shop</span>`;
        } else {
            solHTML += `<span id='cityShop' class='noBuilding'></span>`;
        }

        /** NYI */
        this.hasBazaar = false;
        if (this.hasBazaar) {
            solHTML += `<span id='cityBazaar' class='cityButton'>Bazaar</span>`;
        } else {
            solHTML += `<span id='cityBazaar' class='noBuilding'></span>`;
        }

        if (this.hasGatherInfo) {
            this.timesVisitedGatheredInfo = 0;
            solHTML += `<span id='cityGatherInfo' class='cityButton'>Gather Info</span>`;
        } else {
            solHTML += `<span id='cityGatherInfo' class='noBuilding'></span>`;
        }

        if (this.hasTavern) {
            this.timesVisitedTavern = 0;
            solHTML += `<span id='cityTavern' class='cityButton'>Visit Tavern</span>`;
        } else {
            solHTML += `<span id='cityTavern' class='noBuilding'></span>`;
        }

        /** NYI */
        this.craftingType = "false";
        switch (this.craftingType.toLowerCase()) {
            case "jewelcrafter":
                solHTML += `<span id='cityCrafting' class='cityButton cityJewelcrafter'>Visit Jeweler</span>`;
                break;
            case "blacksmith":
                solHTML += `<span id='cityCrafting' class='cityButton cityBlacksmith'>Visit Blacksmith</span>`;
                break;
            case "leatherworker":
                solHTML += `<span id='cityCrafting' class='cityButton cityLeatherwork'>Visit Leatherworker</span>`;
                break;
            case "tailor":
                solHTML += `<span id='cityCrafting' class='cityButton cityTailor'>Visit Tailor</span>`;
                break;
            case "shrine":
                solHTML += `<span id='cityCrafting' class='cityButton cityShrine'>Visit Shrine</span>`;
                break;
            case "alchemist":
                solHTML += `<span id='cityCrafting' class='cityButton cityAlchemist'>Visit Alchemist</span>`;
                break;
            default:
                solHTML += `<span id='cityCrafting' class='noBuilding'></span>`;
        }

        /* Add the back button. */
        solHTML += `<span id='exitCity' class='cityButton ${this.shortenedName}'>Exit</span>`;

        this.menuHTML = solHTML;
    }

    /** Displays the city menu. */
    display() {
        let sv = State.variables;
        /** We should refer to `menu` instead of `this` because we have some async & changing scope stuff going on. */
        let menu = this;

        sv.PrevGameState = sv.GameState;
        sv.GameState = "citymenu";

        /** Add the HTML to #city-menu */
        $("#city-menu").html(this.menuHTML);

        /** Add the requisite event listeners to the buttons. */
        /* REVIEW: Do I want to wait for the elements to load? */

        if (this.hasGuildHall) {
            $(`#cityGuildHall`).click(function () {
                if (sv.GameState === "citymenu") {
                    let guildhall = new GuildHall(menu);
                    guildhall.display();
                }
            });
        }

        if (this.hasInn) {
            $(`#cityInn`).click(function () {
                if (sv.GameState === "citymenu") {
                    menu.innHandler(menu);
                }
            });
        }

        if (this.hasShop) {
            // NYI: Need items and currency.
        }

        if (this.hasBazaar) {
            // NYI: Need items, currency, economy, and server.
        }

        if (this.hasGatherInfo) {
            $(`#cityGatherInfo`).click(function () {
                if (sv.GameState === "citymenu") {
                    menu.timesVisitedGatheredInfo += 1;
                    menu.gatherInfoHandler(menu, sv.uuid);
                }
            });
        }

        if (this.hasTavern) {
            $(`#cityTavern`).click(function () {
                if (sv.GameState === "citymenu") {
                    menu.timesVisitedTavern += 1;
                    menu.tavernHandler(menu, sv.uuid);
                }
            });
        }

        if (this.craftingType.toLowerCase() !== "none") {
            // NYI: Need items and currency.
        }

        $(`#exitCity.${this.shortenedName}`).click(function () {
            menu.hide();
        });

        /* Actually display the menu. */
        $("#city-menu-container").removeClass("hidden");
    }

    /** Hides the city menu. */
    hide() {
        let sv = State.variables;
        sv.GameState = "map";
        sv.PrevGameState = "citymenu";

        /**
         * Kill #city-menu's children.
         * This should also make all children event handlers open for garbage collecting.
         */
        $("#city-menu").html("");

        $("#city-menu-container").addClass("hidden");
    }

    /** TODO: Test saving and loading. */

    /** Required for SC Saving and loading. */
    clone() {
        return new this.constructor(this);
    }

    /** Required for SC Saving and loading. */
    toJSON() {
        const ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper(`new ${this.constructor.name}($ReviveData$)`, ownData);
    }
}

// Add the required interactable functions to setup.
(function (S) {
    if (!S.map) {
        S.map = {};
    }

    S.map.CityMenu = CityMenu;
})(setup);
