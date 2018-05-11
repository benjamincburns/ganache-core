import { IBlock } from './model/block'
import * as BN from 'bn.js'

export interface IBlockChain {
  getBlockByHash(hash: BN.BN): IBlock
  getBlockHashForNumberOrTag(number: number | string): BN.BN
}
