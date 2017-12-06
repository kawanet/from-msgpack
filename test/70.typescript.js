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
    it("single append() + multiple fetch()", function () {
        var buf = Buffer.concat([AAA, BBB, CCC]);
        var decoder = msgpack.createDecoder();
        var fetch = function () {
            decoder.fetch();
        };
        decoder.append(buf);
        assert.equal(decoder.fetch(), "AAA");
        assert.equal(decoder.fetch(), "BBB");
        assert.equal(decoder.fetch(), "CCC");
        assert.throws(fetch);
    });
    it("multiple append() + multiple fetch()", function () {
        var decoder = msgpack.createDecoder();
        var fetch = function () {
            decoder.fetch();
        };
        decoder.append(AAA).append(BBB).append(CCC);
        assert.equal(decoder.fetch(), "AAA");
        assert.equal(decoder.fetch(), "BBB");
        assert.equal(decoder.fetch(), "CCC");
        assert.throws(fetch);
    });
    it("fragmented append() + multiple fetch()", function () {
        var buf = Buffer.concat([AAA, BBB, CCC]);
        var buf1 = buf.slice(0, 3);
        var buf2 = buf.slice(3, 7);
        var buf3 = buf.slice(7, 11);
        var buf4 = buf.slice(11);
        var decoder = msgpack.createDecoder();
        var fetch = function () {
            decoder.fetch();
        };
        decoder.append(buf1);
        decoder.append(buf2);
        decoder.append(buf3);
        decoder.append(buf4);
        assert.equal(decoder.fetch(), "AAA");
        assert.equal(decoder.fetch(), "BBB");
        assert.equal(decoder.fetch(), "CCC");
        assert.throws(fetch);
    });
    it("fragmented append() + multiple fetch() + rollbacks", function () {
        var buf = Buffer.concat([AAA, BBB, CCC]);
        var buf1 = buf.slice(0, 3);
        var buf2 = buf.slice(3, 7);
        var buf3 = buf.slice(7, 11);
        var buf4 = buf.slice(11);
        var decoder = msgpack.createDecoder();
        var fetch = function () {
            decoder.fetch();
        };
        decoder.append(buf1);
        decoder.append(buf2);
        assert.equal(decoder.fetch(), "AAA");
        assert.throws(fetch);
        decoder.append(buf3);
        assert.equal(decoder.fetch(), "BBB");
        assert.throws(fetch);
        decoder.append(buf4);
        assert.equal(decoder.fetch(), "CCC");
        assert.throws(fetch);
    });
});
