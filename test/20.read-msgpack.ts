"use strict";

import * as assert from "assert";
import {createDecoder} from "../";

const msgpack = createDecoder();
const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    const AAA = Buffer.from([0xa3, 0x41, 0x41, 0x41]);
    const BBB = Buffer.from([0xa3, 0x42, 0x42, 0x42]);
    const CCC = Buffer.from([0xa3, 0x43, 0x43, 0x43]);

    it("msgpack.decode()", () => {
        assert.equal(msgpack.decode(AAA), "AAA");

        // throw when short
        assert.throws(() => msgpack.decode(AAA.slice(0, 2)));
    });

    it("single push() + multiple readMsgpack()", () => {
        const buf = Buffer.concat([AAA, BBB, CCC]);

        const readable = msgpack.createReadable();

        readable.push(buf);
        assert.equal(readable.readMsgpack(), "AAA");
        assert.equal(readable.readMsgpack(), "BBB");
        assert.equal(readable.readMsgpack(), "CCC");

        assert.throws(() => readable.readMsgpack());
    });

    it("multiple push() + multiple readMsgpack()", () => {
        const readable = msgpack.createReadable();

        readable.push(AAA).push(BBB).push(CCC);
        assert.equal(readable.readMsgpack(), "AAA");
        assert.equal(readable.readMsgpack(), "BBB");
        assert.equal(readable.readMsgpack(), "CCC");

        // throw when short
        assert.throws(() => readable.readMsgpack());
    });

    it("fragmented push() + multiple readMsgpack()", () => {
        const buf = Buffer.concat([AAA, BBB, CCC]);
        const buf1 = buf.slice(0, 3);
        const buf2 = buf.slice(3, 7);
        const buf3 = buf.slice(7, 11);
        const buf4 = buf.slice(11);

        const readable = msgpack.createReadable();

        readable.push(buf1);
        readable.push(buf2);
        readable.push(buf3);
        readable.push(buf4);
        assert.equal(readable.readMsgpack(), "AAA");
        assert.equal(readable.readMsgpack(), "BBB");
        assert.equal(readable.readMsgpack(), "CCC");
        assert.throws(() => readable.readMsgpack());
    });

    it("fragmented push() + multiple readMsgpack() + rollbacks", () => {
        const buf = Buffer.concat([AAA, BBB, CCC]);
        const buf1 = buf.slice(0, 3);
        const buf2 = buf.slice(3, 7);
        const buf3 = buf.slice(7, 11);
        const buf4 = buf.slice(11);

        const readable = msgpack.createReadable();

        readable.push(buf1);
        readable.push(buf2);
        assert.equal(readable.readMsgpack(), "AAA");

        readable.begin();
        assert.throws(() => readable.readMsgpack());
        readable.rollback();

        readable.push(buf3);
        assert.equal(readable.readMsgpack(), "BBB");

        readable.begin();
        assert.throws(() => readable.readMsgpack());
        readable.rollback();

        readable.push(buf4);
        assert.equal(readable.readMsgpack(), "CCC");

        assert.throws(() => readable.readMsgpack());
    });
});
