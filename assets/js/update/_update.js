// LINK: assets/js/_setup.js#UPDATE

// Merge this function with GreyElf's function 
// https://discord.com/channels/389867840406159362/389868418855075840/960311869166456904
function update_save() {
  //setup.version -> current version

  // We purposefully don't break out of the switch because we want it to update sequentially.
  switch (State.variables.version) {
    case undefined:
      console.log("Updating save data to %c0.1.0 InDev%c.", "color: lightblue", "color: initial");
      State.variables.version = "0.1.0 InDev";
      Save.autosave.save();
      console.log("Successfully updated save data to %c0.1.0 InDev%c.", "color: lightblue", "color: initial");
    case "0.1.0 InDev":
    //
  }
}
