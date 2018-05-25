// Type definitions for ethereumjs-util 5.1
// Project: https://github.com/ethereumjs/ethereumjs-util#readme
// Definitions by: Juan J. Jimenez-Anca <https://github.com/cortopy>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />

// TODO: MAX_INTEGER as type of BN
// TODO: import types for [`rlp`](https://github.com/ethereumjs/rlp)
// TODO: import types for [`secp256k1`](https://github.com/cryptocoinjs/secp256k1-node/)

declare module 'ethereumjs-util' {
  import BN from 'bn.js'

  type BufferLike = number[]|Buffer|Uint8Array|BN

  export const SHA3_NULL_S: string;

  export const SHA3_RLP_ARRAY_S: string;

  export const SHA3_RLP_S: string;

  export function addHexPrefix(str: string): string;

  export function arrayContainsArray(superset: any, subset: any, some: any): any;

  export function baToJSON(ba: BufferLike | string[]): BufferLike | string[];

  export function bufferToHex(buf: BufferLike): string;

  export function bufferToInt(buf: BufferLike): string;

  export function defineProperties(self: {[k: string]: any}, fields: string[], data: {[k: string]: any}): {[k: string]: any};

  export function ecrecover(msgHash: BufferLike, v: number, r: BufferLike, s: BufferLike): BufferLike;

  export function ecsign(msgHash: BufferLike, privateKey: BufferLike): {[k: string]: any};

  export function fromRpcSig(sig: string): {[k: string]: any};

  export function fromSigned(num: BufferLike): any;

  export function generateAddress(from: BufferLike, nonce: BufferLike): BufferLike;

  export function hashPersonalMessage(message: string): BufferLike;

  export function importPublic(publicKey: BufferLike): BufferLike;

  export function isValidAddress(address: string): boolean;

  export function isValidChecksumAddress(address: BufferLike): boolean;

  export function isValidPrivate(privateKey: BufferLike): boolean;

  export function isValidPublic(publicKey: BufferLike, sanitize?: boolean): any;

  export function isValidSignature(v: BufferLike, r: BufferLike, s: BufferLike, homestead?: boolean): boolean;

  export function privateToAddress(privateKey: BufferLike): BufferLike;

  export function privateToPublic(privateKey: BufferLike): BufferLike;

  export function publicToAddress(pubKey: BufferLike, sanitize?: boolean): BufferLike;

  export function pubToAddress(pubKey: BufferLike, sanitize?: boolean): BufferLike;

  export function ripemd160(a: BufferLike | any[] | string | number, padded: boolean): BufferLike;

  export function rlphash(a: BufferLike | any[] | string | number): BufferLike;

  export function setLengthLeft(msg: BufferLike | any[], length: number, right?: boolean): BufferLike | any[];

  export function setLengthRight(msg: BufferLike | any[], length: number): BufferLike | any[];

  export function sha256(a: BufferLike | any[] | string | number): BufferLike;

  export function sha3(a: BufferLike | any[] | string | number, bits?: number): BufferLike;

  export function toBuffer(v: any): BufferLike;

  export function toChecksumAddress(address: string): string;

  export function toRpcSig(v: number, r: BufferLike, s: BufferLike): string;

  export function toUnsigned(num: any): BufferLike;

  export function unpad<T extends BufferLike | any[] | string>(a: T): T;

  export function zeros(bytes: number): BufferLike;
}
