"use strict";
exports.__esModule = true;
var assert = require("assert");
var msgpack_test_js_1 = require("msgpack-test-js");
var _1 = require("../");
var msgpack = _1.fromMsgpack();
var TITLE = __filename.split("/").pop();
// set 1 for types to run test
var TEST_TYPES = {
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
describe(TITLE, function () {
    msgpack_test_js_1.Group.getGroups().forEach(function (group) {
        describe(group + "", function () {
            group.getExams(TEST_TYPES).forEach(function (exam) {
                exam.getMsgpacks().forEach(function (encoded, idx) {
                    it(exam.stringify(idx), function () {
                        var value = msgpack.decode(encoded);
                        assert(exam.matchValue(value), JSON.stringify(value));
                    });
                });
            });
        });
    });
});
