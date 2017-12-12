"use strict";

const {MsgExt} = require("msg-interface");

const UINT32_NEXT = 0x100000000;
const YES = true;
const NO = false;
const NULL = null;

const READ_DOUBLE = "readDoubleBE";
const READ_FLOAT = "readFloatBE";
const READ_INT8 = "readInt8";
const READ_INT16 = "readInt16BE";
const READ_INT32 = "readInt32BE";
const READ_UINT8 = "readUInt8";
const READ_UINT16 = "readUInt16BE";
const READ_UINT32 = "readUInt32BE";
const READ_STRING = "readString";
const READ_BUFFER = "readBuffer";

exports.initParser = (options) => {
  const parsers = init();
  return parseAny;

  function parseAny(source) {
    const type = source.readUInt8();
    const parser = parsers[type];
    if (!parser) {
      throw new TypeError("Invalid msgpack type: " + type);
    }

    return parser(source, type);
  }

  function init() {
    const parsers = new Array(256);

    let i;
    for (i = 0x00; i < 0x80; i++) parsers[i] = positiveInt8;
    for (i = 0x80; i < 0x90; i++) parsers[i] = parseMapMask;
    for (i = 0x90; i < 0xa0; i++) parsers[i] = parseArrayMask;
    for (i = 0xa0; i < 0xc0; i++) parsers[i] = parseStringMask;

    parsers[0xc0] = parseNil;
    parsers[0xc2] = parseFalse;
    parsers[0xc3] = parseTrue;

    parsers[0xc4] = genFlexParser(READ_UINT8, READ_BUFFER);
    parsers[0xc5] = genFlexParser(READ_UINT16, READ_BUFFER);
    parsers[0xc6] = genFlexParser(READ_UINT32, READ_BUFFER);

    parsers[0xc7] = genFlexExt(READ_UINT8);
    parsers[0xc8] = genFlexExt(READ_UINT16);
    parsers[0xc9] = genFlexExt(READ_UINT32);

    parsers[0xca] = genPasrer(READ_FLOAT);
    parsers[0xcb] = genPasrer(READ_DOUBLE);
    parsers[0xcc] = genPasrer(READ_UINT8);
    parsers[0xcd] = genPasrer(READ_UINT16);
    parsers[0xce] = genPasrer(READ_UINT32);
    parsers[0xcf] = parseUInt64;
    parsers[0xd0] = genPasrer(READ_INT8);
    parsers[0xd1] = genPasrer(READ_INT16);
    parsers[0xd2] = genPasrer(READ_INT32);
    parsers[0xd3] = parseInt64;

    parsers[0xd4] = genFixedExt(1);
    parsers[0xd5] = genFixedExt(2);
    parsers[0xd6] = genFixedExt(4);
    parsers[0xd7] = genFixedExt(8);
    parsers[0xd8] = genFixedExt(16);

    parsers[0xd9] = genFlexParser(READ_UINT8, READ_STRING);
    parsers[0xda] = genFlexParser(READ_UINT16, READ_STRING);
    parsers[0xdb] = genFlexParser(READ_UINT32, READ_STRING);

    parsers[0xdc] = genFlexNest(READ_UINT16, parseArray);
    parsers[0xdd] = genFlexNest(READ_UINT32, parseArray);
    parsers[0xde] = genFlexNest(READ_UINT16, parseMap);
    parsers[0xdf] = genFlexNest(READ_UINT32, parseMap);

    for (i = 0xe0; i < 0x100; i++) parsers[i] = negativeInt8;

    return parsers;
  }

  function parseMapMask(source, type) {
    return parseMap(source, type & 0x0F);
  }

  function parseArrayMask(source, type) {
    return parseArray(source, type & 0x0F);
  }

  function parseMap(source, size) {
    const map = allocMap();
    for (let i = 0; i < size; i++) {
      const key = parseAny(source);
      map[key] = parseAny(source);
    }
    return map;
  }

  function parseArray(source, size) {
    const array = allocArray(size);
    for (let i = 0; i < size; i++) {
      array[i] = parseAny(source);
    }
    return array;
  }
};

function allocArray(size) {
  return new Array(size | 0);
}

function allocMap() {
  return {};
}

function genFlexNest(sizer, parser) {
  return (source, type) => {
    const size = source[sizer]();
    return parser(source, size);
  };
}

function genPasrer(parser) {
  return (source, type) => {
    return source[parser]();
  };
}

function genFlexParser(sizer, parser) {
  return (source, type) => {
    const size = source[sizer]();
    return source[parser](size);
  };
}

function positiveInt8(source, type) {
  return type;
}

function negativeInt8(source, type) {
  return type - 256;
}

function genFixedExt(size) {
  return (source, type) => {
    return parseExt(source, size);
  };
}

function genFlexExt(sizer) {
  return (source, type) => {
    const size = source[sizer]();
    return parseExt(source, size);
  };
}

function parseExt(source, size) {
  const type = source.readInt8();
  const buffer = source.readBuffer(size);
  return new MsgExt(type, buffer);
}

function parseStringMask(source, type) {
  return source.readString(type & 0x1F);
}

function parseUInt64(source) {
  const high = source.readUInt32BE();
  const low = source.readUInt32BE();
  return high * UINT32_NEXT + low;
}

function parseInt64(source) {
  const high = source.readInt32BE();
  const low = source.readUInt32BE();
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
