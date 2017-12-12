"use strict";

const {ReadableBuffer} = require("liberal-buffer");
const {initParser} = require("./parser");

const YES = true;
const NO = false;

class FromMsgpack {
  //
}

exports.fromMsgpack = (options) => {
  const parseAny = initParser(options);
  let sharedDecoder;
  let isRunning;

  class MsgpackReadable extends ReadableBuffer {
    //
  }

  const P = MsgpackReadable.prototype;
  P.readMsgpack = readMsgpack;

  const instance = new FromMsgpack();
  instance.decode = decode;
  instance.createReadable = createReadable;
  return instance;

  function decode(buffer, offset) {
    if (isRunning || !sharedDecoder) {
      sharedDecoder = createReadable();
    }

    isRunning = YES;
    sharedDecoder.empty();
    const value = sharedDecoder.push(buffer, offset).readMsgpack();
    sharedDecoder.empty();
    isRunning = NO;

    return value;
  }

  function createReadable() {
    return new MsgpackReadable();
  }

  function readMsgpack() {
    const self = this;

    self.begin();

    try {
      const value = parseAny(self);
      self.end();
      return value;
    } catch (e) {
      self.rollback();
      throw e;
    }
  }
};