//TODO type declaration file for ethereumjs-vm
const ethereumjsVm: any = require('ethereumjs-vm');

import { IBlock } from '../model/block'

export interface IEVM {
  // TODO: execute transaction
  // TODO: execute block
  // TODO: execute call
}

export class EVM {
  private const _vm: any

  constructor() {
    _vm = new ethereumjsVm({
      blockchain: {
        // TODO
        /* getBlock: function(number: Buffer) : IBlock {
         *
        }*/
      }, 
      enableHomestead: true,
      activatePrecompiles: true
    })
  }
}
