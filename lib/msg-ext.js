"use strict";

const Msg = require("./msg").Msg;

exports.MsgExt = MsgExt;

/**
 * msgpack ext type container
 */

function MsgExt(type, buffer) {
  if (!(this instanceof MsgExt)) return new MsgExt(type, buffer);
  if (!(-129 < type && type < 256)) throw new RangeError("Invalid ext type: " + type);
  Msg.call(this);
  this.type = type;
  this.buffer = bufferify(buffer);
}

const E = MsgExt.prototype = Object.create(Msg.prototype);
E.type = void 0;
E.buffer = void 0;
E.toMsgpack = toMsgpack;

const fixedToken = [];
fixedToken[1] = 0xd4;
fixedToken[2] = 0xd5;
fixedToken[4] = 0xd6;
fixedToken[8] = 0xd7;
fixedToken[16] = 0xd8;

function toMsgpack(reserve) {
  const body = this.buffer;
  const bodySize = body.length;
  const token = fixedToken[bodySize];

  if (token) {
    reserve(1, token, writeInt8);
  } else if (bodySize < 256) {
    reserve(1, 0xc7, writeInt8);
    reserve(1, bodySize, writeInt8);
  } else if (bodySize < 65536) {
    reserve(1, 0xc8, writeInt8);
    reserve(2, bodySize, writeUInt16BE);
  } else {
    reserve(1, 0xc9, writeInt8);
    reserve(4, bodySize, writeUInt32BE);
  }

  reserve(1, this.type, writeInt8);
  reserve(0, body);
}

function writeInt8(buffer, offset, value) {
  buffer[offset] = value & 255;
}

function writeUInt16BE(buffer, offset, value) {
  buffer[offset] = (value >> 8) & 255;
  buffer[offset + 1] = value & 255;
}

function writeUInt32BE(buffer, offset, value) {
  buffer.writeUInt32BE(value, offset);
}

function bufferify(buffer) {
  return (buffer && !Buffer.isBuffer(buffer)) ? Buffer.from(buffer) : buffer;
}
