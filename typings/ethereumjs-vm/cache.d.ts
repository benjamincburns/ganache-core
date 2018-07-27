declare module 'ethereumjs-vm/dist/cache' {
  import BN from 'bn.js'
  import Trie from 'merkle-patricia-tree/baseTrie'
  import Account from 'ethereumjs-account'

  type LargeNumber = string | Buffer | BN
  type Callback<T> = (err: Error | null, result: T) => void

  export class Cache {
    constructor(trie: Trie)
    put(key: LargeNumber, val: LargeNumber, fromTrie: boolean): void
    get(key: LargeNumber): Buffer | undefined
    lookup(key: LargeNumber): Account | undefined
    getOrLoad(key: LargeNumber, cb: Callback<Account | undefined>): void
    warm(addresses: LargeNumber[], cb: Callback<never>): void
    flush(cb: Callback<never>): void
    checkpoint(): void
    revert(): void
    commit(): void
    clear(): void
    del(key: LargeNumber): void
  }

  export default Cache
}
