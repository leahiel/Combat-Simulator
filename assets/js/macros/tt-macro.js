/*
        <<tt passage_name>>words in the story<</tt>>
*/

// It's basically a modified <<include>> that uses tooltipster syntax.
Macro.add("tt", {
  tags: null,
  handler: function () {
    if (this.args.length === 0) {
      return this.error("no passage specified");
    }

    let psg;

    if (typeof this.args[0] === "object") {
      // Argument was in wiki link syntax.
      psg = this.args[0].link;
    } else {
      // Argument was simply the passage name.
      psg = this.args[0];
    }

    if (!Story.has(psg)) {
      return this.error(`passage "${psg}" does not exist`);
    }

    // Custom debug view setup.
    if (Config.debug) {
      this.debugView.modes({ block: true });
    }

    psg = Story.get(psg);

    if (settings.tooltips) {
      new Wikifier(
        this.output,
        "<tooltip class='tooltip' data-tooltip-content='#" +
          psg.title +
          "'>" +
          this.payload[0].contents +
          "<div class='tooltip_templates'><tttext id='" +
          psg.title +
          "'>" +
          psg.processText() +
          "</tttext></tooltip></div>"
      );
    } else {
      // console.log(this);
      new Wikifier(this.output, this.payload[0].contents);
    }
  },
});
