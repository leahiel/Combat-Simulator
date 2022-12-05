(function (S) {
    var getRandomValues;
    var rnds8 = new Uint8Array(16);
    function uuid_rng() {
        if (!getRandomValues) {
            getRandomValues =
                (typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                (typeof msCrypto !== "undefined" &&
                    typeof msCrypto.getRandomValues === "function" &&
                    msCrypto.getRandomValues.bind(msCrypto));
            if (!getRandomValues) {
                throw new Error("crypto.getRandomValues() not supported.");
            }
        }
        return getRandomValues(rnds8);
    }
    var uuid_REGEX =
        /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    function uuid_validate(uuid) {
        return typeof uuid === "string" && uuid_REGEX.test(uuid);
    }
    var uuid_byteToHex = [];
    for (var i = 0; i < 256; i += 1) {
        uuid_byteToHex.push((i + 0x100).toString(16).substr(1));
    }
    function uuid_stringify(arr) {
        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var uuid = (
            uuid_byteToHex[arr[offset + 0]] +
            uuid_byteToHex[arr[offset + 1]] +
            uuid_byteToHex[arr[offset + 2]] +
            uuid_byteToHex[arr[offset + 3]] +
            "-" +
            uuid_byteToHex[arr[offset + 4]] +
            uuid_byteToHex[arr[offset + 5]] +
            "-" +
            uuid_byteToHex[arr[offset + 6]] +
            uuid_byteToHex[arr[offset + 7]] +
            "-" +
            uuid_byteToHex[arr[offset + 8]] +
            uuid_byteToHex[arr[offset + 9]] +
            "-" +
            uuid_byteToHex[arr[offset + 10]] +
            uuid_byteToHex[arr[offset + 11]] +
            uuid_byteToHex[arr[offset + 12]] +
            uuid_byteToHex[arr[offset + 13]] +
            uuid_byteToHex[arr[offset + 14]] +
            uuid_byteToHex[arr[offset + 15]]
        ).toLowerCase();
        if (!uuid_validate(uuid)) {
            throw TypeError("Stringified UUID is invalid");
        }
        return uuid;
    }
    function uuid_v4(options, buf, offset) {
        options = options || {};
        var rnds = options.random || (options.uuid_rng || uuid_rng)();
        rnds[6] = (rnds[6] & 0x0f) | 0x40;
        rnds[8] = (rnds[8] & 0x3f) | 0x80;
        if (buf) {
            offset = offset || 0;
            for (var i = 0; i < 16; i += 1) {
                buf[offset + i] = rnds[i];
            }
            return buf;
        }
        return uuid_stringify(rnds);
    }

    S.uuid_v4 = function () {
        return uuid_v4();
    };
})(setup);
