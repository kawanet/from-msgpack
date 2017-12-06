"use strict";

const LinkedBuffer = require("./linked-buffer").LinkedBuffer;

const undef = void 0;
const YES = true;
const NO = false;

exports.init = (env) => {
  const initParser = require("./parser").init(env);

  class FromMsgpack {
    //
  }

  return (options) => {
    const parseNext = initParser(options);
    let sharedDecoder;
    let isRunning;

    class Decoder {
      constructor() {
        this.current = new LinkedBuffer();
      }
    }

    const P = Decoder.prototype;
    P.append = append;
    P.clear = clear;
    P.fetch = fetch;
    P.current = undef;
    P.cursor = 0;

    const instance = new FromMsgpack();
    instance.decode = decode;
    instance.createDecoder = createDecoder;
    return instance;

    function decode(buffer, offset) {
      if (isRunning || !sharedDecoder) {
        sharedDecoder = createDecoder();
      }

      isRunning = YES;
      sharedDecoder.clear();
      const value = sharedDecoder.append(buffer, offset).fetch();
      sharedDecoder.clear();
      isRunning = NO;

      return value;
    }

    function createDecoder() {
      return new Decoder();
    }

    function fetch() {
      const self = this;
      let current = self.current;
      let cursor = self.cursor;

      const value = parseNext(reserve);

      // commit
      self.current = current;
      self.cursor = cursor;

      return value;

      function reserve(size, then) {
        const prevOffset = cursor;
        const nextOffset = prevOffset + size;
        if (nextOffset <= current.end) {
          cursor = nextOffset;
          if (!then) return;
          return then(current.buffer, prevOffset, nextOffset);
        } else {
          current = extract(current, cursor, size);
          cursor = current.start;
          return reserve(size, then);
        }
      }
    }
  };
};

function clear() {
  const self = this;
  self.current.clear();
  return self;
}

function append(buffer, start) {
  const self = this;
  const current = self.current;
  const isFirst = !current.buffer;
  current.append(buffer, start);
  if (isFirst) {
    self.cursor = +current.start || 0;
  }
  return self;
}

function extract(current, cursor, size) {
  const former = current;
  const latter = current.next;
  if (!latter) throw new RangeError("BUFFER_SHORTAGE");

  // check the current buffer has a rest
  const rest = current.end - cursor;
  if (!rest) return latter;

  // split and combine
  const tmp = LinkedBuffer.from(former.buffer, cursor, former.end);
  const end = latter.start + size - rest;
  tmp.append(latter.buffer, latter.start, end);
  current = LinkedBuffer.from(tmp.toBuffer());

  // insert a partial fragment
  former.next = current;
  former.end = cursor;
  current.next = latter;
  latter.start = end;

  return current;
}
