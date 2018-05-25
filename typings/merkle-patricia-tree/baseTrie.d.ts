declare module 'merkle-patricia-tree/baseTrie' {
  import BN from 'bn.js'
  import { LevelUp } from 'levelup'

  import TrieNode from 'merkle-patricia-tree/trieNode'
  import ReadStream from 'merkle-patricia-tree/readStream'

  type Callback<T> = (err: Error, result: T) => void
  type FindPathCallback = (err: Error, node: TrieNode, keyRemainder: Buffer, stack: TrieNode[]) => void
  type LargeNumber = string | Buffer | BN

  export interface BatchOperation {
    type: 'del' | 'put'
    key: LargeNumber
    value?: LargeNumber
  }

  export class Trie {
    root: Buffer
    constructor(db: LevelUp, root: Buffer)
    get(key: LargeNumber, cb: Callback<Buffer | null>): void
    put(key: LargeNumber, value: LargeNumber, cb: Callback<never>): void
    del(key: LargeNumber, cb: Callback<never>): void
    getRaw(key: LargeNumber, cb: Callback<Buffer | null>): void
    findPath(key: LargeNumber, cb: FindPathCallback): void
    createReadStream(): ReadStream
    copy(): Trie
    batch(ops: BatchOperation[], cb: (err: Error[]) => void): void
    checkRoot(root: LargeNumber, cb: Callback<boolean>): void
  }

  export default Trie
}
