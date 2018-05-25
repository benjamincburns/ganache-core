declare module 'ethereumjs-vm' {
  import BN from 'bn.js'
  import Transaction from 'ethereumjs-tx'
  import { Block } from 'ethereumjs-block'
  import { Blockchain } from 'ethereumjs-blockchain'
  import { StateManager, MinimalBlockchain } from 'ethereumjs-vm/dist/stateManager'
  import Trie from 'merkle-patricia-tree/baseTrie'
  import { EventEmitter} from 'events'

  type LargeNumber = string | Buffer | BN
  type Callback<T> = (err: Error, result: T) => void

  export interface VMOptions {
    activatePrecompiles: boolean
    allowUnlimitedContractSize: boolean
    blockchain: MinimalBlockchain
    state: Trie
    stateManager: StateManager
  }

  export interface RunBlockOptions {
    block: Block
    generate: boolean
  }

  export interface RunCallOptions {
    block: Block
    caller: Buffer
    code: Buffer
    data: Buffer
    gasLimit: Buffer | BN
    gasPrice: Buffer
    origin: Buffer
    to: Buffer
    value: Buffer
  }

  export interface RunCodeOptions {
    account: Account
    address: Buffer
    block: Block
    caller: Buffer
    code: Buffer
    data: Buffer
    gasLimit: Buffer
    origin: Buffer
    value: Buffer
  }

  export interface RunTxOptions {
    block: Block
    skipBalance: boolean
    skipNonce: boolean
    tx: Transaction
  }

  export interface RunState {

  }
  export interface RunCodeResult {
    gas: BN
    gasUsed: BN
    gasRefund: BN
    selfdestruct: { [key: string]: Buffer }
    exception: 0 | 1
    exceptionError: string
    logs: Buffer[][]
    return: Buffer
  }

  export interface RunTxResult {
    amountSpent: BN
    gasUsed: BN
    gasRefund: BN
    vm: RunCodeResult
  }

  export interface RunTxReceipt {
    status: 0 | 1
    gasUsed: Buffer
    bitvector: Buffer
    logs: Buffer[][]
  }

  export interface RunBlockResult {
    receipts: RunTxReceipt[]
    results: RunTxResult[]
  }

  export class VM extends EventEmitter {
    constructor(opts: VMOptions)
    runBlock(opts: RunBlockOptions, cb: Callback<RunBlockResult[]>): void
    runBlockchain(blockchain: Blockchain, cb: Callback<RunBlockResult[]>): void
    runCall(opts: RunCallOptions, cb: Callback<RunCodeResult>): void
    runCode(opts: RunCodeOptions, cb: Callback<RunCodeResult>): void
    runTx(opts: RunTxOptions, cb: Callback<RunTxResult>): void
    copy(): VM
    loadCompiled(address: Buffer, src: Buffer, cb: Callback<never>): void
    populateCache(addresses: Buffer[], cb: Callback<never>): void
  }

  export default VM
}
