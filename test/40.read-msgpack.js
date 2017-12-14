"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const _1 = require("../");
const msgpack = _1.createDecoder();
const TITLE = __filename.split("/").pop();
describe(TITLE, () => {
    const AAA = Buffer.from([0xa3, 0x41, 0x41, 0x41]);
    const BBB = Buffer.from([0xa3, 0x42, 0x42, 0x42]);
    const CCC = Buffer.from([0xa3, 0x43, 0x43, 0x43]);
    it("msgpack.decode()", () => {
        const value = msgpack.decode(AAA);
        assert.equal(value, "AAA");
    });
    it("single push() + multiple readMsgpack()", () => {
        const buf = Buffer.concat([AAA, BBB, CCC]);
        const readable = msgpack.createReadable();
        const readMsgpack = () => {
            readable.readMsgpack();
        };
        readable.push(buf);
        assert.equal(readable.readMsgpack(), "AAA");
        assert.equal(readable.readMsgpack(), "BBB");
        assert.equal(readable.readMsgpack(), "CCC");
        assert.throws(readMsgpack);
    });
    it("multiple push() + multiple readMsgpack()", () => {
        const decoder = msgpack.createReadable();
        const readMsgpack = () => {
            decoder.readMsgpack();
        };
        decoder.push(AAA).push(BBB).push(CCC);
        assert.equal(decoder.readMsgpack(), "AAA");
        assert.equal(decoder.readMsgpack(), "BBB");
        assert.equal(decoder.readMsgpack(), "CCC");
        assert.throws(readMsgpack);
    });
    it("fragmented push() + multiple readMsgpack()", () => {
        const buf = Buffer.concat([AAA, BBB, CCC]);
        const buf1 = buf.slice(0, 3);
        const buf2 = buf.slice(3, 7);
        const buf3 = buf.slice(7, 11);
        const buf4 = buf.slice(11);
        const readable = msgpack.createReadable();
        const readMsgpack = () => {
            readable.readMsgpack();
        };
        readable.push(buf1);
        readable.push(buf2);
        readable.push(buf3);
        readable.push(buf4);
        assert.equal(readable.readMsgpack(), "AAA");
        assert.equal(readable.readMsgpack(), "BBB");
        assert.equal(readable.readMsgpack(), "CCC");
        assert.throws(readMsgpack);
    });
    it("fragmented push() + multiple readMsgpack() + rollbacks", () => {
        const buf = Buffer.concat([AAA, BBB, CCC]);
        const buf1 = buf.slice(0, 3);
        const buf2 = buf.slice(3, 7);
        const buf3 = buf.slice(7, 11);
        const buf4 = buf.slice(11);
        const readable = msgpack.createReadable();
        const readMsgpack = () => {
            readable.readMsgpack();
        };
        readable.push(buf1);
        readable.push(buf2);
        assert.equal(readable.readMsgpack(), "AAA");
        assert.throws(readMsgpack);
        readable.push(buf3);
        assert.equal(readable.readMsgpack(), "BBB");
        assert.throws(readMsgpack);
        readable.push(buf4);
        assert.equal(readable.readMsgpack(), "CCC");
        assert.throws(readMsgpack);
    });
});
