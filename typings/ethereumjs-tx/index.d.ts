declare module 'ethereumjs-tx' {
  import BN from 'bn.js'

  type LargeNumber = string | Buffer | BN

  export interface ITransaction {
    nonce: LargeNumber
    gasPrice: LargeNumber
    gasLimit: LargeNumber
    to?: LargeNumber
    value?: LargeNumber
    data?: LargeNumber
    v?: LargeNumber
    r?: LargeNumber
    s?: LargeNumber
  }

  export class Transaction {
    nonce: Buffer
    gasPrice: Buffer
    gasLimit: Buffer
    to: Buffer
    value: Buffer
    data: Buffer
    v: Buffer
    r: Buffer
    s: Buffer

    raw: Buffer[]

    constructor (data: string | Buffer | number[])
    constructor (data: ITransaction)

    serialize(): Buffer
    toCreationAddress(): boolean
    hash(includeSignature?: boolean): Buffer
    getChainId(): Buffer
    getSenderAddress(): Buffer
    getSenderPublicKey(): Buffer
    verifySignature(): boolean
    sign(privateKey: LargeNumber): void
      getDataFee(): BN
    getBaseFee(): BN
    getUpfrontCost(): BN
    validate(stringError: boolean): string | boolean
    toJSON(labeled?: boolean): object
  }

  export default Transaction
}

