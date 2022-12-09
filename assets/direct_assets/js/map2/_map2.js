// I came to the conclusion that I need to rewrite the map. But since I'm doing this, I'm gonna write it in PIXI instead of Fabric.js.

// Issues with previous system:
//  I combined the drawing and the actual objects, and that was bad.

/**
 * The map should just be canvas. It will ONLY draw already existing objects.
 * The canvas will be stored in sv.canvas.
 * The quest objects will be stored in sv.quest.
 * 
 * Quest objects includes:
 *      UUID, which will only be changed when a quest is made.
 *      The player object.
 *      Every interactable on the screen.
 *          Including the their location on the screen.
 *      Objectives.
 *      Sequence.
 *      The GameState.
 * 
 *  These related objects should be 95% separated from the map:
 *      Interactbles, which can call these 100% separated objects:
 *          Textboxes
 *          City Menu
 *          Combat
 * 
 *  In effect, the map should be 95% read only. The only input it takes is to move the player.
 * 
 *  In theory, _city_inn, _city_guildhall, and _city_menu don't need to be rewritten.
 * 
 */
