/**
 * @see https://github.com/kawanet/from-msgpack
 */

export declare function fromMsgpack(options?: object): FromMsgpack;

declare class FromMsgpack
{
	decode(buffer: Buffer, offset?: number): any;

	createDecoder(): Decoder;
}

declare class Decoder
{
	append(buffer: Buffer, start?: number): this;

	clear(): this;

	fetch(): any;
}

export declare class LinkedBuffer
{
	static from(buffer: Buffer, start?: number, end?: number);

	buffer: Buffer;
	start: number;
	end: number;
	next: this;

	toBuffer(): Buffer;

	append(buffer: Buffer, start?: number, end?: number): this;

	clear(): this;
}

export interface MsgInterface
{
	_isMsg: boolean;

	toMsgpack(): Buffer;
}

export declare abstract class Msg implements MsgInterface
{
	static isMsg(): boolean;

	_isMsg: boolean;

	toMsgpack(): Buffer;
}

export declare class MsgExt extends Msg
{
	constructor(type: number, buffer: Buffer);

	type: number;
	buffer: Buffer;
}
