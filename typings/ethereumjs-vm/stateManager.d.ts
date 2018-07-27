declare module 'ethereumjs-vm/dist/stateManager' {
  import BN from 'bn.js'
  import Trie from 'merkle-patricia-tree/baseTrie'
  import Account from 'ethereumjs-account'
  import Block from 'ethereumjs-block'
  import Cache from 'ethereumjs-vm/dist/cache'

  type LargeNumber = string | Buffer | BN
  type Callback<T> = (err: Error | null, result: T) => void

  export interface MinimalBlockchain {
    getBlock(blockTag: Buffer, cb: Callback<Block>): void
  }

  export interface StateManagerOptions {
    trie: Trie
    blockchain: MinimalBlockchain
  }

  export class StateManager {
    trie: Trie
    blockchain: MinimalBlockchain
    cache: Cache

    constructor(opts: StateManagerOptions)
    copy(): StateManager
    getAccount: Account
    exists(address: Buffer, cb: Callback<boolean>): void
    putAccount(address: Buffer, account: Account, cb: Callback<never>): void
    getAccountBalance(address: LargeNumber, cb: Callback<Buffer>): void
    putAccountBalance(address: LargeNumber, balance: LargeNumber, cb: Callback<never>): void
    putContractCode(address: LargeNumber, value: LargeNumber, cb: Callback<never>): void
    getContractCode(address: LargeNumber, cb: Callback<Buffer | null>): void
    getContractStorage(address: LargeNumber, key: LargeNumber, cb: Callback<Buffer>): void
    putContractStorage(address: LargeNumber, key: LargeNumber, value: LargeNumber, cb: Callback<never>): void
    commitContracts(cb: Callback<never>): void
    revertContracts(): void
    getBlockHash(number: LargeNumber, cb: Callback<Buffer>): void
    checkpoint(): void
    revert(cb: Callback<never>): void
    commit(cb: Callback<never>): void
    getStateRoot(cb: Callback<Buffer>): void
    warmCache(addresses: Buffer[], cb: Callback<Buffer>): void
    dumpStorage(address: LargeNumber, cb: Callback<{ [index: string]: Buffer }>): void
    hasGenesisState(cb: Callback<boolean>): void
    generateCanonicalGenesis(cb: Callback<never>): void
    generateGenesis(initState: { [index: string]: LargeNumber }, cb: Callback<never>): void
    accountIsEmpty(address: LargeNumber, cb: Callback<boolean>): void
    cleanupTouchedAccounts(cb: Callback<never>): void
  }

  export default StateManager
}
