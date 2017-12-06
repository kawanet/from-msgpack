"use strict";

import * as assert from "assert";

import {fromMsgpack} from "../";

const msgpack = fromMsgpack();
const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
	const AAA = Buffer.from([0xa3, 0x41, 0x41, 0x41]);
	const BBB = Buffer.from([0xa3, 0x42, 0x42, 0x42]);
	const CCC = Buffer.from([0xa3, 0x43, 0x43, 0x43]);

	it("msgpack.decode()", () => {
		const value = msgpack.decode(AAA);
		assert.equal(value, "AAA");
	});

	it("single append() + multiple fetch()", () => {
		const buf = Buffer.concat([AAA, BBB, CCC]);

		const decoder = msgpack.createDecoder();
		const fetch = () => {
			decoder.fetch()
		};

		decoder.append(buf);
		assert.equal(decoder.fetch(), "AAA");
		assert.equal(decoder.fetch(), "BBB");
		assert.equal(decoder.fetch(), "CCC");
		assert.throws(fetch);
	});

	it("multiple append() + multiple fetch()", () => {
		const decoder = msgpack.createDecoder();
		const fetch = () => {
			decoder.fetch()
		};

		decoder.append(AAA).append(BBB).append(CCC);
		assert.equal(decoder.fetch(), "AAA");
		assert.equal(decoder.fetch(), "BBB");
		assert.equal(decoder.fetch(), "CCC");
		assert.throws(fetch);
	});

	it("fragmented append() + multiple fetch()", () => {
		const buf = Buffer.concat([AAA, BBB, CCC]);
		const buf1 = buf.slice(0, 3);
		const buf2 = buf.slice(3, 7);
		const buf3 = buf.slice(7, 11);
		const buf4 = buf.slice(11);

		const decoder = msgpack.createDecoder();
		const fetch = () => {
			decoder.fetch()
		};

		decoder.append(buf1);
		decoder.append(buf2);
		decoder.append(buf3);
		decoder.append(buf4);
		assert.equal(decoder.fetch(), "AAA");
		assert.equal(decoder.fetch(), "BBB");
		assert.equal(decoder.fetch(), "CCC");
		assert.throws(fetch);
	});

	it("fragmented append() + multiple fetch() + rollbacks", () => {
		const buf = Buffer.concat([AAA, BBB, CCC]);
		const buf1 = buf.slice(0, 3);
		const buf2 = buf.slice(3, 7);
		const buf3 = buf.slice(7, 11);
		const buf4 = buf.slice(11);

		const decoder = msgpack.createDecoder();
		const fetch = () => {
			decoder.fetch()
		};

		decoder.append(buf1);
		decoder.append(buf2);
		assert.equal(decoder.fetch(), "AAA");
		assert.throws(fetch);
		decoder.append(buf3);
		assert.equal(decoder.fetch(), "BBB");
		assert.throws(fetch);
		decoder.append(buf4);
		assert.equal(decoder.fetch(), "CCC");
		assert.throws(fetch);
	});
});
