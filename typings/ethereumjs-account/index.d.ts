declare module 'ethereumjs-account' {
  import BN from 'bn.js'
  import Trie from 'merkle-patricia-tree/baseTrie'

  type LargeNumber = string | Buffer | BN
  type Callback<T> = (err: Error | null, result: T) => void

  export interface IAccount {
    nonce: Buffer
    balance: Buffer
    stateRoot: Buffer
    codeHash: Buffer
  }

  export class Account {
    nonce: Buffer
    balance: Buffer
    stateRoot: Buffer
    codeHash: Buffer
    raw: Buffer

    constructor(data: string | Buffer | number[])
    serialize(): Buffer
    toJSON(label: boolean): object
    isContract(): boolean
    getCode(state: Trie, cb: Callback<Buffer>): void
    setCode(trie: Trie, code: LargeNumber, cb: Callback<never>): void
    getStorage(trie: Trie, key: LargeNumber, cb: Callback<Buffer>): void
    setStorage(trie: Trie, key: LargeNumber, val: LargeNumber, cb: Callback<never>): void
    isEmpty(): boolean
  }

  export default Account
}
