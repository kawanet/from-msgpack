"use strict";

const {ReadableBuffer} = require("liberal-buffer");
const {initParser} = require("./parser");

const YES = true;
const NO = false;

class MsgpackDecoder {

  createReadable() {
    const readable = new ReadableMsgpack();
    readable._readMsgpack = this._readMsgpack;
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
    this.begin();

    try {
      const value = this._readMsgpack(this);
      this.end();
      return value;
    } catch (e) {
      this.rollback();
      throw e;
    }
  }
}

exports.createDecoder = (options) => {
  const msgpack = new MsgpackDecoder();
  msgpack._readMsgpack = initParser(options);
  return msgpack;
};
