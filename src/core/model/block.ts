import * as BN from 'bn.js'
import { IExecutedTransaction } from './transactions'

interface IBlock {
  number: number
  hash: BN.BN | null
  parentHash: BN.BN | null
  nonce: BN.BN | null
  transactionsRoot: BN.BN
  stateRoot: BN.BN
  receiptsRoot: BN.BN
  miner: BN.BN
  difficulty: BN.BN
  totalDifficulty: BN.BN
  extraData: BN.BN
  size: number
  gasLimit: BN.BN
  timestamp: Date
  transactions: IExecutedTransaction[]
  uncleHashes: BN.BN[]
}
