"use strict";
exports.__esModule = true;
var assert = require("assert");
var _1 = require("../");
var msgpack = _1.fromMsgpack();
var TITLE = __filename.split("/").pop();
describe(TITLE, function () {
    var AAA = Buffer.from([0xa3, 0x41, 0x41, 0x41]);
    var BBB = Buffer.from([0xa3, 0x42, 0x42, 0x42]);
    var CCC = Buffer.from([0xa3, 0x43, 0x43, 0x43]);
    it("msgpack.decode()", function () {
        var value = msgpack.decode(AAA);
        assert.equal(value, "AAA");
    });
    it("single push() + multiple readMsgpack()", function () {
        var buf = Buffer.concat([AAA, BBB, CCC]);
        var readable = msgpack.createReadable();
        var readMsgpack = function () {
            readable.readMsgpack();
        };
        readable.push(buf);
        assert.equal(readable.readMsgpack(), "AAA");
        assert.equal(readable.readMsgpack(), "BBB");
        assert.equal(readable.readMsgpack(), "CCC");
        assert.throws(readMsgpack);
    });
    it("multiple push() + multiple readMsgpack()", function () {
        var decoder = msgpack.createReadable();
        var readMsgpack = function () {
            decoder.readMsgpack();
        };
        decoder.push(AAA).push(BBB).push(CCC);
        assert.equal(decoder.readMsgpack(), "AAA");
        assert.equal(decoder.readMsgpack(), "BBB");
        assert.equal(decoder.readMsgpack(), "CCC");
        assert.throws(readMsgpack);
    });
    it("fragmented push() + multiple readMsgpack()", function () {
        var buf = Buffer.concat([AAA, BBB, CCC]);
        var buf1 = buf.slice(0, 3);
        var buf2 = buf.slice(3, 7);
        var buf3 = buf.slice(7, 11);
        var buf4 = buf.slice(11);
        var readable = msgpack.createReadable();
        var readMsgpack = function () {
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
    it("fragmented push() + multiple readMsgpack() + rollbacks", function () {
        var buf = Buffer.concat([AAA, BBB, CCC]);
        var buf1 = buf.slice(0, 3);
        var buf2 = buf.slice(3, 7);
        var buf3 = buf.slice(7, 11);
        var buf4 = buf.slice(11);
        var readable = msgpack.createReadable();
        var readMsgpack = function () {
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
