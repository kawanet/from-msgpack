"use strict";

const {ReadableBuffer} = require("liberal-buffer");
const {initParser} = require("./parser");

const YES = true;
const NO = false;

class MsgpackDecoder {

  createReadable() {
    const readable = new ReadableMsgpack();
    readable.readMsgpack = this._readMsgpack;
    return readable;
  }

  decode(buffer, offset) {
    const readable = !this.running && this.readable || (this.readable = this.createReadable());

    this.running = YES;
    readable.empty();
    const value = readable.push(buffer, offset).readMsgpack();
    readable.empty();
    this.running = NO;

    return value;
  }
}

class ReadableMsgpack extends ReadableBuffer {

  readMsgpack() {
    throw new Error("readMsgpack() not implemented");
  }
}

exports.createDecoder = (options) => {
  const parseAny = initParser(options);

  const msgpack = new MsgpackDecoder();
  msgpack._readMsgpack = readMsgpack;
  return msgpack;

  function readMsgpack(value) {
    this.begin();

    try {
      const value = parseAny(this);
      this.end();
      return value;
    } catch (e) {
      this.rollback();
      throw e;
    }
  }
};
