/**
 * @see https://github.com/kawanet/from-msgpack
 */

import {ReadableBuffer} from "liberal-buffer";

export declare function fromMsgpack(options?: object): FromMsgpack;

declare class FromMsgpack {
    decode(buffer: Buffer, offset?: number): any;

    createReadable(): MsgpackReadable;
}

declare class MsgpackReadable extends ReadableBuffer {
    readMsgpack(): any;
}
