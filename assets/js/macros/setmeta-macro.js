/*
        <<setmeta {foo:bar, foz:baz}>>
*/

// It's basically a modified <<set>> that requires a JSON object and
// sends information to the database.
Macro.add("setmeta", {
    skipArgs: true,

    handler() {
        if (this.args.full.length === 0) {
            return this.error("no expression specified");
        }

        if (typeof this.args !== "object") {
            return this.error('expression must be a JSON object with "key" : value pairs');
        }

        try {
            let objVars = JSON.parse(this.args.full);

            // Set Local Meta Vars

            for (let key in objVars) {
                State.variables.meta[key] = objVars[key];
            }

            // Send Meta Vars to DB

            if (State.variables.user.logged_in) {
                setametaHelper(objVars);
            } else {
                // We're not logged in. This can happen for a variety of
                // reasons, most importantly, the page just hasn't loaded yet,
                // so wait 5 seconds and try again. If it doesn't work then,
                // there is probably a good reason for it, e.g. they're just
                // not logged in at all.
                // XXX: Perhaps use time() to determine how long the page has been rendered.
                // Or even, use an async method to determine when the Engine is done rendering.
                setTimeout(() => {
                    if (State.variables.user.logged_in) {
                        setametaHelper(objVars);
                    }
                }, "5000"); // Try again in 5 seconds.
            }
        } catch (e) {
            return this.error(`bad evaluation: ${typeof e === "object" ? e.message : e}`);
        }

        // Custom debug view setup.
        if (Config.debug) {
            this.debugView.modes({ hidden: true });
        }

        function setametaHelper(obj) {
            if (State.variables.meta.psgsthatsentdb.includes(passage())) {
                // We already sent these meta vars to server. This implementation
                // means that we can have, at max, one <<setmeta>> macro a passage.
                return;
            }
            db.setDBVars(State.variables.user.itch_id, obj);
            State.variables.meta.psgsthatsentdb.push(passage());
        }
    },
});
