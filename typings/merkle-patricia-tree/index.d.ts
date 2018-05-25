declare module 'merkle-patricia-tree' {
  import BN from 'bn.js'
  import { LevelUp } from 'levelup'
  import { Readable } from 'stream'

  import Trie from 'merkle-patricia-tree/baseTrie'
  import TrieNode from 'merkle-patricia-tree/trieNode'

  type MerkleProof = TrieNode[]
  type Callback<T> = (err: Error, result: T) => void
  type LargeNumber = string | Buffer | BN

  export class ScratchReadStream extends Readable {
    trie: Trie
  }

  export class CheckpointTrie extends Trie {
    readonly isCheckpoint: boolean

    checkpoint(): void
    commit(cb: Callback<never>): void
    revert(cb: Callback<never>): void
    createScratchReadStream(scratch: LevelUp): ScratchReadStream
    static prove(trie: Trie, key: LargeNumber, cb: Callback<MerkleProof>): void
    static verifyProof(rootHash: LargeNumber, key: LargeNumber, proof: MerkleProof, cb: Callback<Buffer>): void
  }

  export default CheckpointTrie
}
