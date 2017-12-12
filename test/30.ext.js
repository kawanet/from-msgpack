"use strict";
exports.__esModule = true;
var assert = require("assert");
var msg_interface_1 = require("msg-interface");
var _1 = require("../");
var msgpack = _1.fromMsgpack();
var TITLE = __filename.split("/").pop();
describe(TITLE, function () {
    var D4 = "d4-10-11";
    it(D4, function () {
        var ext = msgpack.decode(hexToBinary(D4));
        assert(ext instanceof msg_interface_1.MsgExt, "should MsgExt instance");
        assert(msg_interface_1.Msg.isMsg(ext), "should Msg instance");
        assert.equal(ext.type, 0x10);
        assert.equal(ext.buffer.length, 1);
        assert.equal(ext.buffer[0], 0x11);
    });
    var D5 = "d5-20-21-22";
    it(D5, function () {
        var ext = msgpack.decode(hexToBinary(D5));
        assert(ext instanceof msg_interface_1.MsgExt, "should MsgExt instance");
        assert(msg_interface_1.Msg.isMsg(ext), "should Msg instance");
        assert.equal(ext.type, 0x20);
        assert.equal(ext.buffer.length, 2);
        assert.equal(ext.buffer[0], 0x21);
    });
    var D6 = "d6-30-31-32-33-34";
    it(D6, function () {
        var ext = msgpack.decode(hexToBinary(D6));
        assert(ext instanceof msg_interface_1.MsgExt, "should MsgExt instance");
        assert(msg_interface_1.Msg.isMsg(ext), "should Msg instance");
        assert.equal(ext.type, 0x30);
        assert.equal(ext.buffer.length, 4);
        assert.equal(ext.buffer[0], 0x31);
    });
    var D7 = "d7-40-41-42-43-44-45-46-47-48";
    it(D7, function () {
        var ext = msgpack.decode(hexToBinary(D7));
        assert(ext instanceof msg_interface_1.MsgExt, "should MsgExt instance");
        assert(msg_interface_1.Msg.isMsg(ext), "should Msg instance");
        assert.equal(ext.type, 0x40);
        assert.equal(ext.buffer.length, 8);
        assert.equal(ext.buffer[0], 0x41);
    });
    var D8 = "d8-50-51-52-53-55-55-56-57-58-59-5a-5b-5c-5d-5e-5f-60";
    it(D8, function () {
        var ext = msgpack.decode(hexToBinary(D8));
        assert(ext instanceof msg_interface_1.MsgExt, "should MsgExt instance");
        assert(msg_interface_1.Msg.isMsg(ext), "should Msg instance");
        assert.equal(ext.type, 0x50);
        assert.equal(ext.buffer.length, 16);
        assert.equal(ext.buffer[0], 0x51);
    });
    var C7 = "c7-01-02-03";
    it(C7, function () {
        var ext = msgpack.decode(hexToBinary(C7));
        assert(ext instanceof msg_interface_1.MsgExt, "should MsgExt instance");
        assert(msg_interface_1.Msg.isMsg(ext), "should Msg instance");
        assert.equal(ext.type, 0x02);
        assert.equal(ext.buffer.length, 1);
        assert.equal(ext.buffer[0], 0x03);
    });
    var C8 = "c8-00-02-03-04-05";
    it(C8, function () {
        var ext = msgpack.decode(hexToBinary(C8));
        assert(ext instanceof msg_interface_1.MsgExt, "should MsgExt instance");
        assert(msg_interface_1.Msg.isMsg(ext), "should Msg instance");
        assert.equal(ext.type, 0x03);
        assert.equal(ext.buffer.length, 2);
        assert.equal(ext.buffer[0], 0x04);
    });
    var C9 = "c9-00-00-00-03-04-05-06-07";
    it(C9, function () {
        var ext = msgpack.decode(hexToBinary(C9));
        assert(ext instanceof msg_interface_1.MsgExt, "should MsgExt instance");
        assert(msg_interface_1.Msg.isMsg(ext), "should Msg instance");
        assert.equal(ext.type, 0x04);
        assert.equal(ext.buffer.length, 3);
        assert.equal(ext.buffer[0], 0x05);
    });
});
function hexToBinary(str) {
    var array = str.split(/[^0-9a-fA-F]+/).map(parseHex);
    return Buffer.from(array);
}
function parseHex(str) {
    return parseInt(str, 16);
}