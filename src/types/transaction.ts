import { BN } from 'bn.js'

import { Account } from './account'

export interface ITransactionSignature {
  v: BN
  r: BN
  s: BN
}
export class TransactionSignature {
  v: BN
  r: BN
  s: BN

  constructor(signature: ITransactionSignature) {
    this.v = signature.v
    this.r = signature.r
    this.s = signature.s
  }
}

export interface ITransactionSigner {
  signTransaction(input: IPendingTransaction) : TransactionSignature
}

export interface ITransactionLog {
  removed: boolean
  originatingAddress: BN
  data: BN
  topics: BN[]
}

export class TransactionLog implements ITransactionLog {
  removed: boolean
  originatingAddress: BN
  data: BN
  topics: BN[]

  constructor(log: TransactionLog) {
    this.removed = log.removed
    this.originatingAddress = log.originatingAddress
    this.data = log.data
    this.topics = log.topics
  }

  //TODO: add filter tests here
}

export interface IPendingTransaction {
  nonce: number
  from: BN
  to: BN
  value: BN
  gasPrice: BN
  gas: BN
  input: BN
}

export class PendingTransaction implements IPendingTransaction {
  nonce: number
  from: BN
  to: BN
  value: BN
  gasPrice: BN
  gas: BN
  input: BN

  private _hash: BN

  constructor(tx: IPendingTransaction) {
    this.nonce = tx.nonce
    this.from = tx.from
    this.to = tx.to
    this.value = tx.value
    this.gasPrice = tx.gasPrice
    this.gas = tx.gas
    this.input = tx.input
  }

  get hash() : BN {
    //TODO: calculate transaction hash
    return new BN(1)
  }
}

export interface ISignedTransaction extends IPendingTransaction {
  signature: TransactionSignature
}

export class SignedTransaction extends PendingTransaction implements SignedTransaction {
  signature: TransactionSignature

  constructor(tx: ISignedTransaction | IPendingTransaction, signer?: ITransactionSigner | TransactionSignature) {
    super(tx)

    if (signer && (signer as ITransactionSigner).signTransaction) {
      this.signature = (signer as ITransactionSigner).signTransaction(tx)
    } else if (signer && signer instanceof TransactionSignature) {
      this.signature = signer
    } else if ((tx as ISignedTransaction).signature) {
      this.signature = (tx as ISignedTransaction).signature
    } else {
      throw new Error("Input transaction is not signed, and no signature or signing account argument given.")
    }
  }

}

export interface IExecutedTransaction extends ISignedTransaction {
  cumulativeGasUsed: BN
  gasUsed: BN
  contractAddress: BN | null
  logs: ITransactionLog[]
  logsBloom: BN
  executedSuccessfully: boolean
}

export class ExecutedTransaction extends SignedTransaction implements IExecutedTransaction {
  cumulativeGasUsed: BN
  gasUsed: BN
  contractAddress: BN | null
  logs: TransactionLog[]
  logsBloom: BN
  executedSuccessfully: boolean

  constructor(tx: IExecutedTransaction) {
    super(tx)
    this.cumulativeGasUsed = tx.cumulativeGasUsed
    this.gasUsed = tx.gasUsed
    this.contractAddress = tx.contractAddress
    this.logs = tx.logs.slice()
    this.logsBloom = tx.logsBloom
    this.executedSuccessfully = tx.executedSuccessfully
  }
}
