import * as BN from 'bn.js'

export interface ITransactionLog {
  removed: boolean
  originatingAddress: BN.BN
  data: BN.BN
  topics: BN.BN[]
}

export interface ITransactionSignature {
  v: BN.BN
  r: BN.BN
  s: BN.BN
}

export interface IPendingTransaction {
  hash: BN.BN
  nonce: number
  transactionIndex: number
  from: BN.BN
  to: BN.BN
  value: BN.BN
  gasPrice: BN.BN
  gas: BN.BN
  input: BN.BN
}

export interface ISignedTransaction extends IPendingTransaction {
  signature: ITransactionSignature
}

export interface IExecutedTransaction extends ISignedTransaction {
  cumulativeGasUsed: BN.BN
  gasUsed: BN.BN
  contractAddress: BN.BN | null
  logs: ITransactionLog[]
  logsBloom: BN.BN
  executedSuccessfully: boolean
}

export class TransactionLog implements ITransactionLog {
  const removed: boolean
  const originatingAddress: BN.BN
  const data: BN.BN
  const topics: BN.BN[]

  constructor(log: ITransactionLog) {
    this.removed = log.removed
    this.originatingAddress = log.originatingAddress
    this.data = log.data
    this.topics = log.topics
  }

  //TODO: add filter tests here
}

export class PendingTransaction implements IPendingTransaction {
  const nonce: number
  const from: BN.BN
  const to: BN.BN
  const value: BN.BN
  const gasPrice: BN.BN
  const gas: BN.BN
  const input: BN.BN

  private const _hash: BN.BN

  constructor(tx: IPendingTransaction) {
    this.nonce = tx.nonce
    this.from = tx.from
    this.to = tx.to
    this.value = tx.value
    this.gasPrice = tx.gasPrice
    this.gas = tx.gas
    this.input = tx.input
  }

  get hash() {
    //TODO: calculate transaction hash
  }
}

export class SignedTransaction extends PendingTransaction implements ISignedTransaction {
  const signature: ITransactionSignature

  constructor(tx: ISignedTransaction | IPendingTransaction, signer?: IAccount) {
    super(tx)

    if (signer) {
      this.signature = signer.signTransaction(signer)
    } else if (_isSignedTransaction(tx)) {
      this.signature = tx.signature
    } else {
      throw new Error("No signature or signing account given.")
    }
  }

  static isSignedTransaction(tx: ISignedTransaction | IPendingTransaction): tx is ISignedTransaction {
    return <ISignedTransaction>tx.signature !== undefined
  }
}

export class ExecutedTransaction extends SignedTransaction implements IExecutedTransaction {
  cumulativeGasUsed: BN.BN
  gasUsed: BN.BN
  contractAddress: BN.BN | null
  logs: ITransactionLog[]
  logsBloom: BN.BN
  executedSuccessfully: boolean


  static isExecutedTransaction(tx: IExecutedTransaction | IPendingTransaction): tx is ISignedTransaction {
    return <ISignedTransaction>tx.signature !== undefined
  }
}
