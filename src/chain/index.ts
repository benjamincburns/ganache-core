import { Block } from './model/block'
import { BN } from 'bn.js'

export class Blockchain {
  async getBlockByNumber(number: BN): Block {
    throw new Error("not yet implemented")
  }

  async getBlockByHash(hash: BN): Block {
    throw new Error("not yet implemented")
  }

}
