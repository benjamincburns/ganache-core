import { IBlock } from './model/block'
import { BN } from 'bn.js'

export interface IBlockChain {
  getBlockByHash(hash: BN): IBlock
  getBlockHashForNumberOrTag(number: number | string): BN
}
