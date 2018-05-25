declare module 'ethereumjs-wallet' {
  import BN from 'bn.js'

  type LargeNumber = string | Buffer | BN

  interface V3Options {
    salt?: Buffer
    iv?: Buffer
    kdf: string
    dklen: number
    c: number
    n: number
    r: number
    p: number
    cipher: string
    uuid: Buffer
  }

  export class Wallet {
    privKey: Buffer
    pubKey: Buffer

    constructor(priv: Buffer, pub?: Buffer)
    static generate(icapDirect?: boolean): Wallet
    static generateVanityAddress(pattern: string|RegExp): Wallet
    getPrivateKey(): Buffer
    getPrivateKeyString(): string
    getPublicKey(): Buffer
    getPublicKeyString: string
    getAddress: Buffer
    getAddressString: string
    getChecksumAddressString: string
    toV3(password: LargeNumber, opts: V3Options): object
    getV3Filename(timestamp: Date): string
    toV3String(password: LargeNumber, opts: V3Options): string
    static fromPublicKey(pub: LargeNumber, nonStrict?: boolean): Wallet
    static fromPrivateKey(priv: LargeNumber): Wallet
    static fromExtendedPrivateKey(priv: LargeNumber): Wallet
    static fromV1(input: any, password: LargeNumber): Wallet
    static fromV3(input: any, password: LargeNumber): Wallet
    static fromEthSale(input: any, password: LargeNumber): Wallet
  }

  export default Wallet
}
