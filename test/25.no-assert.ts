"use strict";

import * as assert from "assert";
import {createDecoder} from "../";

const msgpack = createDecoder({noAssert: true});
const TITLE = __filename.split("/").pop();
const undef = void 0;

describe(TITLE, () => {
    const AAA = Buffer.from([0xa3, 0x41, 0x41, 0x41]);
    const BBB = Buffer.from([0xa3, 0x42, 0x42, 0x42]);
    const CCC = Buffer.from([0xa3, 0x43, 0x43, 0x43]);

    it("msgpack.decode()", () => {
        assert.equal(msgpack.decode(AAA), "AAA");

        // no assertion
        assert.equal(msgpack.decode(AAA.slice(0, 2)), undef);
    });

    it("single push() + multiple readMsgpack()", () => {
        const buf = Buffer.concat([AAA, BBB, CCC]);

        const readable = msgpack.createReadable();

        readable.push(buf);
        assert.equal(readable.readMsgpack(), "AAA");
        assert.equal(readable.readMsgpack(), "BBB");
        assert.equal(readable.readMsgpack(), "CCC");

        // no assertion
        assert.equal(readable.readMsgpack(), undef);
    });
});
