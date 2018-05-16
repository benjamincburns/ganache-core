import { BN } from 'bn.js'
import { ISignedTransaction, IExecutedTransaction } from './transaction'

export interface IPendingBlock {
  number: number
  parentHash: BN | null
  nonce: BN | null
  transactionsRoot: BN
  stateRoot: BN
  receiptsRoot: BN
  miner: BN
  difficulty: BN
  totalDifficulty: BN
  extraData: BN
  gasLimit: BN
  timestamp: Date
  transactions: ISignedTransaction[]
}

export interface IExecutedBlock extends IPendingBlock {
  transactions: IExecutedTransaction[]
  uncleHashes: BN[]
}

export class PendingBlock implements IPendingBlock {
  number: number
  parentHash: BN | null
  nonce: BN | null
  transactionsRoot: BN
  stateRoot: BN
  receiptsRoot: BN
  miner: BN
  difficulty: BN
  totalDifficulty: BN
  extraData: BN
  gasLimit: BN
  timestamp: Date
  transactions: ISignedTransaction[]

  constructor(block: IPendingBlock) {
    this.number = block.number
    this.parentHash = block.parentHash
    this.nonce = block.nonce
    this.transactionsRoot = block.transactionsRoot
    this.stateRoot = block.stateRoot
    this.receiptsRoot = block.receiptsRoot
    this.miner = block.miner
    this.difficulty = block.difficulty
    this.totalDifficulty = block.totalDifficulty
    this.extraData = block.extraData
    this.gasLimit = block.gasLimit
    this.timestamp = block.timestamp
    this.transactions = block.transactions
  }

  get hash() {
    //TODO
    return new BN(1)
  }

  get size() {
    //TODO
    return 2
  }
}

export class ExecutedBlock extends PendingBlock implements IExecutedBlock {
  transactions: IExecutedTransaction[]
  uncleHashes: BN[]

  constructor(block: IExecutedBlock) {
    super(block)
    this.transactions = block.transactions
    this.uncleHashes = block.uncleHashes
  }
}
