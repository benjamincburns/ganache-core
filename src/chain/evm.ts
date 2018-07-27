import VM from 'ethereumjs-vm'
import EJSBlock from 'ethereumjs-block'
import StateManager from 'ethereumjs-vm/dist/stateManager'

import Callback from '../types/callback'
import { Blockchain } from './index'
import { Block } from '../model/block'
import { Database } from '../persistence'

const MAX_JS_NUMBER = new BN(Number.MAX_SAFE_INTEGER)

function getBlockchainProxy(blockchain: Blockchain) {
  return {
    getBlock: function(number: Buffer, cb: Callback<EJSBlock>) {
      (async() => {
        const num = new BN(number)
        let fn = num.lte(MAX_JS_NUMBER) ?
          blockchain.getBlockByNumber :
          blockchain.getBlockByHash
        try {
          let block = await fn(num)
          cb(null, block.toEJSBlock())
        } catch (err: Error) {
          cb(err)
        }
      })()
    }
  }
}

export class EVM {
  private _blockchain: Blockchain

  constructor(blockchain: Blockchain, db: Database, stateRoot?: BN) {
    this._blockchain = blockchain
    // INIT steps
    // create MinimalBlockchain and pass to VM
    // if forked:
    //   initialize vm.stateManager._lookupStorageTrie
    //   initialize vm.stateManager.cache._lookupAccount
    //   initialize vm.stateManager.getContractCode
    //   initialize vm.stateManager.putContractCode

    let blockchainProxy = getBlockchainProxy(this._blockchain)

    _vm = new VM({
      blockchain: blockchainProxy,
      enableHomestead: true,
      activatePrecompiles: true
    })
  }
}
