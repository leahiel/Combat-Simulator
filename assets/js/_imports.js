// LINK: assets/js/_setup.js#IMPORTS
function importGameSSR() {
  /* Useful if you have server-side stuff that you're doing. */
  importScripts("src/assets/js/game_ssr.min.js")
    /* NOTE: You have to manually copy over the game_ssr.js webpack. A symlink doesn't work for some reason. This is done automatically in the build.bat. ...Strictly speaking, I don't need to import the above, but they give a promise and I have to have them loaded to do things, so... */
    .then(() => {
      /* Ensure we are logged in every time. */
      State.variables.user.logged_in = false;

      /* FIXME SERVER: We are making a local db from the exported object db (from game_ssr.js) This line is fucking cursed. Rename the exported object. */
      db = new db();

      if (!recall("user-uuid")) {
        /* Brand new UUID, so the user will need to log in. */
        memorize("user-uuid", uuid_v4());
        db.createLoginChecker(recall("user-uuid"), loggedin);
        return;
      }

      /* The UUID already exists, so let's try to get the itch_id and DB variables. */
      try {
        db.getItchID(recall("user-uuid")).then((result) => {
          /* If we can't get the ID, they've never logged in. */
          if (result === undefined || result.itch_id === undefined) {
            /* We've never logged in. */
            db.createLoginChecker(recall("user-uuid"), loggedin);
            return;
          }

          loggedin(result.itch_id);
        });
      } catch (e) {
        console.warn(e);
      }
    })
    .catch((e) => {
      console.warn(e);
    });

  /* Run this one we are logged in. */
  function loggedin(id) {
    State.variables.user.itch_id = id;

    db.getDBVars(State.variables.user.itch_id)
      .then((result) => {
        /* When merging, if there are duplicate key names, the 
    properties of the last object listed overwrites the 
    previous one(s). */
        State.variables.meta = {
          ...State.variables.meta,
          ...result,
        };
      })
      .then(() => {
        /* Set our client as logged in. */
        State.variables.user.logged_in = true;
        Engine.show(); // to rerun <<setmeta>>
      });

    /* REQUIRED: Create a one-time dialogue box that says, "You logged in! :D" */

    return;
  }
}

async function importDiscordWidget() {
  importScripts("https://cdn.jsdelivr.net/npm/@widgetbot/crate@3").then(() => {
    new Crate({
      server: "1001698951516397590" /* LeahPeach Stories */,
      channel: "1001708306416533514" /* #📣┊announcements  */,
    });
  });
}
