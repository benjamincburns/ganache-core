import { BN } from 'bn.js'

import EJSFakeTransaction from 'ethereumjs-tx/fake'
import EJSTransaction from 'ethereumjs-tx'

import { Account } from './account'
import { ITransactionLog, TransactionLog } from './log'

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

export interface IPendingTransaction {
  nonce: BN
  from: BN
  to: BN
  value: BN
  gasPrice: BN
  gasLimit: BN
  data: BN
}

export class PendingTransaction implements IPendingTransaction {
  nonce: BN
  from: BN
  to: BN
  value: BN
  gasPrice: BN
  gasLimit: BN
  data: BN

  private _hash: BN

  constructor(tx: IPendingTransaction) {
    this.nonce = tx.nonce
    this.from = tx.from
    this.to = tx.to
    this.value = tx.value
    this.gasPrice = tx.gasPrice
    this.gasLimit = tx.gasLimit
    this.data = tx.data
  }

  get hash() : BN {
    return new BN(this.toFakeTransaction().hash())
  }

  toFakeTransaction(): EJSFakeTransaction {
    return new EJSFakeTransaction(this)
  }

  toEJSTransaction(): EJSTransaction {
    return new EJSTransaction(this)
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

  toEJSTransaction(): EJSTransaction {
    let { nonce, to, value, gasPrice, gasLimit, data } = this
    let { v, r, s } = this.signature
    return new EJSTransaction({
      nonce,
      to,
      value,
      gasPrice,
      gasLimit,
      data,
      v,
      r,
      s
    })
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
