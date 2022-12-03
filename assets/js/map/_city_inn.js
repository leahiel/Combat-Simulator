/** TODO I want INN to use an InnHandler like GatherInfo and Taverns, and then have it call the proper inn screen after. */

const DEFAULTINNTB = {
    showBackground: true,
    backgroundSrc: "src/assets/img/png/tavern1.png",
    lines: [
        {
            line: "Welcome to ${name}!",
        },
    ],
};

const DEFAULTINN = {
    name: "Unknown Name",
    textbox: {
        DEFAULTINNTB,
    },
};

/**
 *
 */
class Inn {
    constructor(cityMenu, obj) {
        let sv = State.variables;

        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, DEFAULTINN, obj);

        /** Save the city menu HTML for later replacement. */
        this.cityMenu = cityMenu;

        /** Add the swappable menu partners. */
        this.potentialPartners = [];

        // TODO Inn textbox.
        this.textbox = {};

        this.generateMenu();

        sv.innInstance = this;
    }

    /** Generate the menu HTML and event listeners. */
    generateMenu() {
        let sv = State.variables;

        /** This HTML will become the children of `#city-menu` when it is time to show the inn. */
        let solHTML = "";

        /** Returns an array, [Str, [func, func, func...]]. The array of functions are all event listeners to be called later. */
        function writeEquipmentButtons(char, varName) {
            if (char === undefined) {
                return [
                    `<span id='equipmentViewingButtons' class=${varName}>Char Not Found</span>`,
                    [
                        function () {
                            return;
                        },
                    ],
                ];
            }

            let solstr = "";
            let eventListeners = [];
            solstr += `<span id='equipmentViewingButtons' class=${varName}>`;
            solstr += `<span id='equipmentViewingName' class=${varName}>${char.name}</span>`;

            // Weapons
            solstr += `<span class='itemPlate weapon ${varName}'>${char.equippables.weapon.name}`;
            solstr += `<span id='weaponInfoScreenButtons' class='itemPlateButtonHolder weapon ${varName}'>`;
            solstr += `<button class="macro-but ${varName} equip" type="button" role="button" tabindex="0">Equip</button>`;
            eventListeners.push(function () {
                $(`#equipmentViewingButtons.${varName} .itemPlate.weapon button.equip`).click(function () {
                    Dialog.setup(`Equip Your Weapons`, "dialogEquipmentSwap");
                    Dialog.wiki(`<<SlotMenuInfo weapon $${varName}>>`);
                    Dialog.open();
                });
            });

            if (char.equippables.weapon.type !== "unequipped") {
                solstr += `<button class="macro-but ${varName} mod" type="button" role="button" tabindex="0">Mods</button>`;
                eventListeners.push(function () {
                    $(`#equipmentViewingButtons.${varName} .itemPlate.weapon button.mod`).click(function () {
                        Dialog.setup(`Mod Your Weapons`, "dialogEquipmentSwap");
                        Dialog.wiki(`<<SlotModMenuInfo weapon $${varName}>>`);
                        Dialog.open();
                    });
                });
            } else {
                solstr += `<button class="macro-but ${varName} disabled" type="button" role="button" tabindex="0">Mods</button>`;
            }
            solstr += `</span>`;
            solstr += `</span>`;

            // Armors
            solstr += `<span class='itemPlate armor ${varName}'>${char.equippables.armor.name}`;
            solstr += `<span id='armorInfoScreenButtons' class='itemPlateButtonHolder armor ${varName}'>`;
            solstr += `<button class="macro-but ${varName} equip" type="button" role="button" tabindex="0">Equip</button>`;
            eventListeners.push(function () {
                $(`#equipmentViewingButtons.${varName} .itemPlate.armor button.equip`).click(function () {
                    Dialog.setup(`Equip Your Armor`, "dialogEquipmentSwap");
                    Dialog.wiki(`<<SlotMenuInfo armor $${varName}>>`);
                    Dialog.open();
                });
            });
            if (char.equippables.armor.type !== "unequipped") {
                solstr += `<button class="macro-but ${varName} mod" type="button" role="button" tabindex="0">Mods</button>`;
                eventListeners.push(function () {
                    $(`#equipmentViewingButtons.${varName} .itemPlate.armor button.mod`).click(function () {
                        Dialog.setup(`Mod Your Armor`, "dialogEquipmentSwap");
                        Dialog.wiki(`<<SlotModMenuInfo armor $${varName}>>`);
                        Dialog.open();
                    });
                });
            } else {
                solstr += `<button class="macro-but ${varName} disabled" type="button" role="button" tabindex="0">Mods</button>`;
            }
            solstr += `</span>`;
            solstr += `</span>`;

            // Accessories
            solstr += `<span class='itemPlate accessory ${varName}'>${char.equippables.accessory.name}`;
            solstr += `<span id='accessoryInfoScreenButtons' class='itemPlateButtonHolder accessory ${varName}'>`;
            solstr += `<button class="macro-but ${varName} equip" type="button" role="button" tabindex="0">Equip</button>`;
            eventListeners.push(function () {
                $(`#equipmentViewingButtons.${varName} .itemPlate.accessory button.equip`).click(function () {
                    Dialog.setup(`Equip Your Accessories`, "dialogEquipmentSwap");
                    Dialog.wiki(`<<SlotMenuInfo accessory $${varName}>>`);
                    Dialog.open();
                });
            });
            if (char.equippables.accessory.type !== "unequipped") {
                solstr += `<button class="macro-but ${varName} mod" type="button" role="button" tabindex="0">Mods</button>`;
                eventListeners.push(function () {
                    $(`#equipmentViewingButtons.${varName} .itemPlate.accessory button.mod`).click(function () {
                        Dialog.setup(`Mod Your Accessories`, "dialogEquipmentSwap");
                        Dialog.wiki(`<<SlotModMenuInfo accessory $${varName}>>`);
                        Dialog.open();
                    });
                });
            } else {
                solstr += `<button class="macro-but ${varName} disabled" type="button" role="button" tabindex="0">Mods</button>`;
            }
            solstr += `</span>`;
            solstr += `</span>`;
            solstr += `</span>`;

            return [solstr, eventListeners];
        }

        let charEventListeners = [];
        let pcHTML = writeEquipmentButtons(sv.pc, "pc");
        solHTML += pcHTML[0];
        pcHTML[1].forEach((func) => {
            charEventListeners.push(func);
        });

        let ppHTML = writeEquipmentButtons(sv.pp, "pp");
        solHTML += ppHTML[0];
        ppHTML[1].forEach((func) => {
            charEventListeners.push(func);
        });

        let tp1HTML = writeEquipmentButtons(sv.tp1, "tp1");
        solHTML += tp1HTML[0];
        tp1HTML[1].forEach((func) => {
            charEventListeners.push(func);
        });

        let tp2HTML = writeEquipmentButtons(sv.tp2, "tp2");
        solHTML += tp2HTML[0];
        tp2HTML[1].forEach((func) => {
            charEventListeners.push(func);
        });

        /* Add the back button. */
        solHTML += `<span id='exitCity' class='cityButton cityInn'>Leave Inn</span>`;

        this.menuHTML = solHTML;
        this.menuEL = charEventListeners;
    }

    /** Displays the inn menu. */
    display() {
        /** We should refer to `menu` instead of `this` because we have some async & changing scope stuff going on. */
        let menu = this;

        /** Add the guildhall HTML to #city-menu */
        $("#city-menu").html("");
        $("#city-menu").html(menu.menuHTML);

        /** Add the requisite event listeners to the buttons. */
        /* REVIEW: Do I want to wait for the elements to load? */

        /* Add all the event listeners we made with Inn.generateMenu() we made the equipment buttons. */
        for (let charEL of this.menuEL) {
            charEL();
        }

        $(`#exitCity.cityInn`).click(function () {
            menu.back();
        });
    }

    /** Returns to the city menu. */
    back() {
        State.variables.innInstance = undefined;
        $("#city-menu").html("");
        this.cityMenu.display();
    }
}

// Add the required interactable functions to setup.
(function (S) {
    if (!S.map) {
        S.map = {};
    }

    // S.map.Inn = Inn;
})(setup);
