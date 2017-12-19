"use strict";

import * as assert from "assert";
import {isMsg, MsgExt} from "msg-interface";
import {createDecoder} from "../";

const msgpack = createDecoder();
const TITLE = __filename.split("/").pop();

describe(TITLE, () => {

    const D4 = "d4-10-11";
    it(D4, () => {
        const ext = msgpack.decode(hexToBinary(D4));
        assert(ext instanceof MsgExt, "should be a MsgExt instance");
        assert(isMsg(ext), "should implement Msg interface");
        assert.equal(ext.type, 0x10);
        assert.equal(ext.buffer.length, 1);
        assert.equal(ext.buffer[0], 0x11);
    });

    const D5 = "d5-20-21-22";
    it(D5, () => {
        const ext = msgpack.decode(hexToBinary(D5));
        assert(ext instanceof MsgExt, "should be a MsgExt instance");
        assert(isMsg(ext), "should implement Msg interface");
        assert.equal(ext.type, 0x20);
        assert.equal(ext.buffer.length, 2);
        assert.equal(ext.buffer[0], 0x21);
    });

    const D6 = "d6-30-31-32-33-34";
    it(D6, () => {
        const ext = msgpack.decode(hexToBinary(D6));
        assert(ext instanceof MsgExt, "should be a MsgExt instance");
        assert(isMsg(ext), "should implement Msg interface");
        assert.equal(ext.type, 0x30);
        assert.equal(ext.buffer.length, 4);
        assert.equal(ext.buffer[0], 0x31);
    });

    const D7 = "d7-40-41-42-43-44-45-46-47-48";
    it(D7, () => {
        const ext = msgpack.decode(hexToBinary(D7));
        assert(ext instanceof MsgExt, "should be a MsgExt instance");
        assert(isMsg(ext), "should implement Msg interface");
        assert.equal(ext.type, 0x40);
        assert.equal(ext.buffer.length, 8);
        assert.equal(ext.buffer[0], 0x41);
    });

    const D8 = "d8-50-51-52-53-55-55-56-57-58-59-5a-5b-5c-5d-5e-5f-60";
    it(D8, () => {
        const ext = msgpack.decode(hexToBinary(D8));
        assert(ext instanceof MsgExt, "should be a MsgExt instance");
        assert(isMsg(ext), "should implement Msg interface");
        assert.equal(ext.type, 0x50);
        assert.equal(ext.buffer.length, 16);
        assert.equal(ext.buffer[0], 0x51);
    });

    const C7 = "c7-01-02-03";
    it(C7, () => {
        const ext = msgpack.decode(hexToBinary(C7));
        assert(ext instanceof MsgExt, "should be a MsgExt instance");
        assert(isMsg(ext), "should implement Msg interface");
        assert.equal(ext.type, 0x02);
        assert.equal(ext.buffer.length, 1);
        assert.equal(ext.buffer[0], 0x03);
    });

    const C8 = "c8-00-02-03-04-05";
    it(C8, () => {
        const ext = msgpack.decode(hexToBinary(C8));
        assert(ext instanceof MsgExt, "should be a MsgExt instance");
        assert(isMsg(ext), "should implement Msg interface");
        assert.equal(ext.type, 0x03);
        assert.equal(ext.buffer.length, 2);
        assert.equal(ext.buffer[0], 0x04);
    });

    const C9 = "c9-00-00-00-03-04-05-06-07";
    it(C9, () => {
        const ext = msgpack.decode(hexToBinary(C9));
        assert(ext instanceof MsgExt, "should be a MsgExt instance");
        assert(isMsg(ext), "should implement Msg interface");
        assert.equal(ext.type, 0x04);
        assert.equal(ext.buffer.length, 3);
        assert.equal(ext.buffer[0], 0x05);
    });
});

function hexToBinary(str: string) {
    const array = str.split(/[^0-9a-fA-F]+/).map(parseHex);
    return Buffer.from(array);
}

function parseHex(str: string) {
    return parseInt(str, 16);
}
