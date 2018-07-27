import { BN } from 'bn.js'
import { SerializedBN, toBN, toSerializedBN } from './bn'
import {
  TransactionSignature,
  PendingTransaction,
  SignedTransaction,
  ExecutedTransaction
} from '../transaction'

import {
  SerializedTransactionLog,
  toTransactionLog,
  toSerializedTransactionLog
} from './log'

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

export interface SerializedPendingTransaction {
  nonce: SerializedBN
  from: SerializedBN
  to: SerializedBN
  value: SerializedBN
  gasPrice: SerializedBN
  gasLimit: SerializedBN
  data: SerializedBN
}

export function toPendingTransaction(input: SerializedPendingTransaction): PendingTransaction {
  return new PendingTransaction({
    nonce: toBN(input.nonce),
    from: toBN(input.from),
    to: toBN(input.to),
    value: toBN(input.value),
    gasPrice: toBN(input.gasPrice),
    gasLimit: toBN(input.gasLimit),
    data: toBN(input.data)
  })
}

export function toSerializedPendingTransaction(input: PendingTransaction): SerializedPendingTransaction {
  return {
    nonce: toSerializedBN(input.nonce),
    from: toSerializedBN(input.from),
    to: toSerializedBN(input.to),
    value: toSerializedBN(input.value),
    gasPrice: toSerializedBN(input.gasPrice),
    gasLimit: toSerializedBN(input.gasLimit),
    data: toSerializedBN(input.data)
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
    gasLimit: signedTransaction.gasLimit,
    data: signedTransaction.data,
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
    logs: input.logs.map(toSerializedTransactionLog),
    logsBloom: toSerializedBN(input.logsBloom),
    executedSuccessfully: input.executedSuccessfully
  }
}
