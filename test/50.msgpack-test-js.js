"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const msgpack_test_js_1 = require("msgpack-test-js");
const _1 = require("../");
const msgpack = _1.fromMsgpack();
const TITLE = __filename.split("/").pop();
// set 1 for types to run test
const TEST_TYPES = {
    array: 1,
    bignum: 0,
    binary: 1,
    bool: 1,
    ext: 1,
    map: 1,
    nil: 1,
    number: 1,
    string: 1,
    timestamp: 0
};
describe(TITLE, () => {
    msgpack_test_js_1.Group.getGroups().forEach((group) => {
        describe(group + "", () => {
            group.getExams(TEST_TYPES).forEach((exam) => {
                exam.getMsgpacks().forEach((encoded, idx) => {
                    it(exam.stringify(idx), function () {
                        const value = msgpack.decode(encoded);
                        assert(exam.matchValue(value), JSON.stringify(value));
                    });
                });
            });
        });
    });
});
