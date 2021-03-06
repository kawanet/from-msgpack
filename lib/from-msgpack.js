"use strict";

const {ReadableBuffer} = require("liberal-buffer");
const {initParser} = require("./parser");

const YES = true;
const NO = false;
const BUFFER_SHORTAGE = "Unexpected end of msgpack input";

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

  pull(length) {
    throw new SyntaxError(BUFFER_SHORTAGE);
  }
}

exports.createDecoder = (options) => {
  if (!options) options = {};
  const parseAny = initParser(options);

  const msgpack = new MsgpackDecoder();
  msgpack._readMsgpack = options.noAssert ? readMsgpackNoAssert : readMsgpack;
  return msgpack;

  function readMsgpackNoAssert() {
    try {
      this.begin();
      const value = parseAny(this);
      this.end();
      return value;
    } catch (e) {
      this.rollback();
      const isShortage = (e instanceof SyntaxError) && (e.message === BUFFER_SHORTAGE);
      if (!isShortage) throw e;
    }
  }

  function readMsgpack(noAssert) {
    return parseAny(this);
  }
};
