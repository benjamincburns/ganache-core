import { BN } from 'bn.js'

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

