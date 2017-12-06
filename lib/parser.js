"use strict";

const MsgExt = require("./msg-ext").MsgExt;

const UINT32_NEXT = 0x100000000;
const UTF8 = "utf8";
const YES = true;
const NO = false;
const NULL = null;

const parseDouble = bufferMethod("readDoubleBE");
const parseFloat = bufferMethod("readFloatBE");
const parseInt16 = bufferMethod("readInt16BE");
const parseInt32 = bufferMethod("readInt32BE");
const parseInt8 = bufferMethod("readInt8");
const parseUInt16 = bufferMethod("readUInt16BE");
const parseUInt32 = bufferMethod("readUInt32BE");

exports.init = (env) => {
  return (options) => {
    const parsers = init();
    return parseNext;

    function parseNext(reserve) {
      return reserve(1, (buffer, start) => {
        const type = buffer[start];

        const parser = parsers[type];
        if (!parser) {
          throw new TypeError("Invalid msgpack type: " + type);
        }

        return parser(reserve, type);
      });
    }

    function init() {
      const parsers = new Array(256);

      let i;
      for (i = 0x00; i < 0x80; i++) parsers[i] = positiveInt8;
      for (i = 0x80; i < 0x90; i++) parsers[i] = genNestMask(0x0F, parseMap);
      for (i = 0x90; i < 0xa0; i++) parsers[i] = genNestMask(0x0F, parseArray);
      for (i = 0xa0; i < 0xc0; i++) parsers[i] = genParserMask(0x1F, parseString);

      parsers[0xc0] = parseNil;
      parsers[0xc2] = parseFalse;
      parsers[0xc3] = parseTrue;

      parsers[0xc4] = genParserFlex(1, parseUInt8, parseBinary);
      parsers[0xc5] = genParserFlex(2, parseUInt16, parseBinary);
      parsers[0xc6] = genParserFlex(4, parseUInt32, parseBinary);

      parsers[0xc7] = genExtFlex(1, parseUInt8);
      parsers[0xc8] = genExtFlex(2, parseUInt16);
      parsers[0xc9] = genExtFlex(4, parseUInt32);

      parsers[0xca] = genParserFixed(4, parseFloat);
      parsers[0xcb] = genParserFixed(8, parseDouble);
      parsers[0xcc] = genParserFixed(1, parseUInt8);
      parsers[0xcd] = genParserFixed(2, parseUInt16);
      parsers[0xce] = genParserFixed(4, parseUInt32);
      parsers[0xcf] = genParserFixed(8, parseUInt64);
      parsers[0xd0] = genParserFixed(1, parseInt8);
      parsers[0xd1] = genParserFixed(2, parseInt16);
      parsers[0xd2] = genParserFixed(4, parseInt32);
      parsers[0xd3] = genParserFixed(8, parseInt64);

      parsers[0xd4] = genExtFixed(1);
      parsers[0xd5] = genExtFixed(2);
      parsers[0xd6] = genExtFixed(4);
      parsers[0xd7] = genExtFixed(8);
      parsers[0xd8] = genExtFixed(16);

      parsers[0xd9] = genParserFlex(1, parseUInt8, parseString);
      parsers[0xda] = genParserFlex(2, parseUInt16, parseString);
      parsers[0xdb] = genParserFlex(4, parseUInt32, parseString);
      parsers[0xdc] = genNestFlex(2, parseUInt16, parseArray);
      parsers[0xdd] = genNestFlex(4, parseUInt32, parseArray);
      parsers[0xde] = genNestFlex(2, parseUInt16, parseMap);
      parsers[0xdf] = genNestFlex(4, parseUInt32, parseMap);

      for (i = 0xe0; i < 0x100; i++) parsers[i] = negativeInt8;

      return parsers;
    }

    function parseMap(reserve, size) {
      const map = allocMap();
      for (let i = 0; i < size; i++) {
        const key = parseNext(reserve);
        map[key] = parseNext(reserve);
      }
      return map;
    }

    function parseArray(reserve, size) {
      const array = allocArray(size);
      for (let i = 0; i < size; i++) {
        array[i] = parseNext(reserve);
      }
      return array;
    }
  };
};

function allocArray(size) {
  return new Array(size | 0);
}

function allocMap() {
  return {};
}

function genNestMask(mask, parser) {
  return (reserve, type) => {
    const size = type & mask;
    return parser(reserve, size);
  };
}

function genNestFlex(len, sizer, parser) {
  return (reserve, type) => {
    return reserve(len, (buffer, pos) => {
      const size = sizer(buffer, pos);
      return parser(reserve, size);
    });
  };
}

function genParserFixed(size, parser) {
  return (reserve, type) => {
    return reserve(size, parser);
  };
}

function genParserMask(mask, parser) {
  return (reserve, type) => {
    const size = type & mask;
    return reserve(size, parser);
  };
}

function genParserFlex(len, sizer, parser) {
  return (reserve, type) => {
    return reserve(len, (buffer, start) => {
      const size = sizer(buffer, start);
      return reserve(size, parser);
    });
  };
}

function positiveInt8(reserve, type) {
  return type;
}

function negativeInt8(reserve, type) {
  return type - 256;
}

function genExtFixed(size) {
  return (reserve, type) => {
    return makeExt(size, reserve);
  };
}

function genExtFlex(len, sizer) {
  return (reserve, type) => {
    return reserve(len, (buffer, start) => {
      const size = sizer(buffer, start);
      return makeExt(size, reserve);
    });
  };
}

function makeExt(size, reserve) {
  return reserve(1, (buffer, start) => {
    const type = buffer[start];
    return reserve(size, (buffer, start, end) => {
      const sliced = buffer.slice(start, end);
      return new MsgExt(type, sliced);
    });
  });
}

function bufferMethod(method) {
  return (buffer, offset) => {
    return buffer[method](offset, true);
  };
}

function parseString(buffer, start, end) {
  return buffer.toString(UTF8, start, end);
}

function parseBinary(buffer, start, end) {
  return buffer.slice(start, end);
}

function parseUInt8(buffer, start) {
  return buffer[start];
}

function parseUInt64(buffer, start) {
  const high = parseUInt32(buffer, start);
  const low = parseUInt32(buffer, start + 4);
  return high * UINT32_NEXT + low;
}

function parseInt64(buffer, start) {
  const high = parseInt32(buffer, start);
  const low = parseUInt32(buffer, start + 4);
  return high * UINT32_NEXT + low;
}

function parseNil() {
  return NULL;
}

function parseTrue() {
  return YES;
}

function parseFalse() {
  return NO;
}
