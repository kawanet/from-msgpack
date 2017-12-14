/**
 * @see https://github.com/kawanet/from-msgpack
 */

import {ReadableBuffer} from "liberal-buffer";

export declare function createDecoder(options?: object): MsgpackDecoder;

declare class MsgpackDecoder {
    decode(buffer: Buffer, offset?: number): any;

    createReadable(): ReadableMsgpack;
}

declare class ReadableMsgpack extends ReadableBuffer {
    readMsgpack(): any;
}
