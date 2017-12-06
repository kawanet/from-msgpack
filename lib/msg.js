"use strict";

exports.Msg = Msg;

/**
 * a msgpack representation container
 */

function Msg() {
  //
}

Msg.isMsg = isMsg;
const M = Msg.prototype;
M._isMsg = true;
M.toMsgpack = toMsgpack;

function isMsg(msg) {
  return !!(msg && msg._isMsg);
  // return !!(msg && msg._isMsg && "function" === typeof msg.toMsgpack);
}

function toMsgpack() {
  throw new Error("method not implemented: toMsgpack");
}
