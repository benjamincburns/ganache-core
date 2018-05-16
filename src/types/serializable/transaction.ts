import { BN } from 'bn.js'
import { SerializedBN, toBN, toSerializedBN } from './bn'
import {
  TransactionSignature,
  TransactionLog,
  PendingTransaction,
  SignedTransaction,
  ExecutedTransaction
} from '../transaction'

export interface SerializedTransactionSignature {
  v: SerializedBN
  r: SerializedBN
  s: SerializedBN
}

export function toTransactionSignature(input: SerializedTransactionSignature): TransactionSignature {
  return new TransactionSignature({
    v: toBN(input.v),
    r: toBN(input.r),
    s: toBN(input.s)
  })
}

export function toSerializedTransactionSignature(input: TransactionSignature): SerializedTransactionSignature {
  return {
    v: toSerializedBN(input.v),
    r: toSerializedBN(input.r),
    s: toSerializedBN(input.s) 
  }
}

export interface SerializedTransactionLog {
  removed: boolean
  originatingAddress: SerializedBN
  data: SerializedBN
  topics: SerializedBN[]
}

export function toTransactionLog(input: SerializedTransactionLog) : TransactionLog {
  return new TransactionLog({
    removed: input.removed,
    originatingAddress: toBN(input.originatingAddress),
    data: toBN(input.data),
    topics: input.topics.map(toBN)
  })
}

export function toSerializedTransactionLog(input: TransactionLog) : SerializedTransactionLog {
  return {
    removed: input.removed,
    originatingAddress: toSerializedBN(input.originatingAddress),
    data: toSerializedBN(input.data),
    topics: input.topics.map(toSerializedBN)
  }
}

export interface SerializedPendingTransaction {
  nonce: number
  from: SerializedBN
  to: SerializedBN
  value: SerializedBN
  gasPrice: SerializedBN
  gas: SerializedBN
  input: SerializedBN
}

export function toPendingTransaction(input: SerializedPendingTransaction): PendingTransaction {
  return new PendingTransaction({
    nonce: input.nonce,
    from: toBN(input.from),
    to: toBN(input.to),
    value: toBN(input.value),
    gasPrice: toBN(input.gasPrice),
    gas: toBN(input.gas),
    input: toBN(input.input)
  })
}

export function toSerializedPendingTransaction(input: PendingTransaction): SerializedPendingTransaction {
  return {
    nonce: input.nonce,
    from: toSerializedBN(input.from),
    to: toSerializedBN(input.to),
    value: toSerializedBN(input.value),
    gasPrice: toSerializedBN(input.gasPrice),
    gas: toSerializedBN(input.gas),
    input: toSerializedBN(input.input)
  }
}

export interface SerializedSignedTransaction extends SerializedPendingTransaction {
  signature: SerializedTransactionSignature
}

export function toSignedTransaction(input: SerializedSignedTransaction) : SignedTransaction {
  return new SignedTransaction(toPendingTransaction(input), toTransactionSignature(input.signature))
}

export function toSerializedSignedTransaction(input: SignedTransaction) : SerializedSignedTransaction {
  return {
    ...toSerializedPendingTransaction(input),
    signature: toSerializedTransactionSignature(input.signature)
  }
}

export interface SerializedExecutedTransaction extends SerializedSignedTransaction {
  cumulativeGasUsed: SerializedBN
  gasUsed: SerializedBN
  contractAddress: SerializedBN | null
  logs: SerializedTransactionLog[]
  logsBloom: SerializedBN
  executedSuccessfully: boolean
}

export function toExecutedTransaction(input: SerializedExecutedTransaction) : ExecutedTransaction {
  let signedTransaction = toSignedTransaction(input)
  return new ExecutedTransaction({
    nonce: signedTransaction.nonce,
    from: signedTransaction.from,
    to: signedTransaction.to,
    value: signedTransaction.value,
    gasPrice: signedTransaction.gasPrice,
    gas: signedTransaction.gas,
    input: signedTransaction.input,
    signature: signedTransaction.signature,
    cumulativeGasUsed: toBN(input.cumulativeGasUsed),
    gasUsed: toBN(input.gasUsed),
    contractAddress: input.contractAddress ? toBN(input.contractAddress) : null,
    logs: input.logs.map(toTransactionLog),
    logsBloom: toBN(input.logsBloom),
    executedSuccessfully: input.executedSuccessfully
  })
}

export function toSerializedExecutedTransaction(input: ExecutedTransaction) : SerializedExecutedTransaction {
  return {
    ...toSerializedSignedTransaction(input),
    cumulativeGasUsed: toSerializedBN(input.cumulativeGasUsed),
    gasUsed: toSerializedBN(input.gasUsed),
    contractAddress: input.contractAddress ? toSerializedBN(input.contractAddress) : null,
    logs: input.logs.map(toTransactionLog),
    logsBloom: toSerializedBN(input.logsBloom),
    executedSuccessfully: input.executedSuccessfully
  }
}
