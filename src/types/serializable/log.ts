import { SerializedBN, toBN, toSerializedBN } from './bn'
import { TransactionLog } from '../log'

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

