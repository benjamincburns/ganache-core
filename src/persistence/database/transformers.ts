import { ExecutedBlock } from '../../types/block'
import { SerializedExecutedBlock, toExecutedBlock, toSerializedExecutedBlock } from '../../types/serializable/block'
import { ExecutedTransaction } from '../../types/transaction'
import { TransactionLog } from '../../types/log'

import { SerializedExecutedTransaction, toExecutedTransaction, toSerializedExecutedTransaction } from '../../types/serializable/transaction'
import { SerializedTransactionLog, toTransactionLog, toSerializedTransactionLog } from '../../types/serializable/log'
import { BidirectionalTransformer } from '../../types/functional'

import { BN } from 'bn.js'

export class ArrayTransformer<T, U> implements BidirectionalTransformer<T[], U[]> {
  private _serializer: BidirectionalTransformer<T, U>

  constructor(serializer: BidirectionalTransformer<T, U>) {
    this._serializer = serializer
  }

  encode(input: T[]) {
    return input.map(this._serializer.encode)
  }

  decode(input: U[]) {
    return input.map(this._serializer.decode)
  }
}

export const bnTransformer = {
  encode: (input: BN) => input.toString('hex'),
  decode: (input: string) => new BN(input)
}

export const bufferTransformer = {
  encode: (input: Buffer) => input.toString('hex'),
  decode: (input: string) => Buffer.from(input, 'hex')
}

export const executedBlockTransformer = {
  encode: (input: ExecutedBlock) => toSerializedExecutedBlock(input),
  decode: (input: SerializedExecutedBlock) => toExecutedBlock(input)
}

export const executedTransactionTransformer = {
  encode: (input: ExecutedTransaction) => toSerializedExecutedTransaction(input),
  decode: (input: SerializedExecutedTransaction) => toExecutedTransaction(input)
}

export class NullTransformer<T> implements BidirectionalTransformer<T, T> {
  encode(input: T) {
    return input
  }

  decode(input: T) {
    return input
  }
}

export const transactionLogTransformer = {
  encode: (input: TransactionLog) => toSerializedTransactionLog(input),
  decode: (input: SerializedTransactionLog) => toTransactionLog(input)
}
