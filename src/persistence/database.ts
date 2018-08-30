import { BN } from 'bn.js'

import { AbstractLevelDOWN } from 'abstract-leveldown'
import * as LevelUp from 'levelup'
import * as MedeaDOWN from 'medeadown'
import FileDOWN from './database/filedown'
import * as CacheDOWN from 'cachedown'
import LevelUpArrayAdapter from './database/leveluparrayadapter'
import LevelUpObjectAdapter from './database/levelupobjectadapter'

import { ExecutedBlock } from '../types/block'
import { ExecutedTransaction } from '../types/transaction'
import { TransactionLog } from '../types/log'

import {
  ArrayTransformer,
  bnTransformer,
  bufferTransformer,
  executedBlockTransformer,
  executedTransactionTransformer,
  NullTransformer,
  transactionLogTransformer
} from './database/transformers'

import { dir } from 'tmp'
import * as pify from 'pify'

export interface DatabaseOptions<K=any, V=any, O=any, PO=any, GO=any, DO=any, IO=any, BO=any> {
  db?: AbstractLevelDOWN<K, V, O, PO, GO, DO, IO, BO> | ((location: string) => AbstractLevelDOWN<K, V, O, PO, GO, DO, IO, BO>)
  dataPath?: string
}

export class Database<K=any, V=any, O=any, PO=any, GO=any, DO=any, IO=any, BO=any> {

  private _options: DatabaseOptions<K, V, O, PO, GO, DO, IO, BO>
  private _db: LevelUp.LevelUp

  blocksByNumber: LevelUpArrayAdapter<ExecutedBlock>
  logsByBlock: LevelUpArrayAdapter<TransactionLog[]>
  blockHashes: LevelUpObjectAdapter<BN, number>
  transactions: LevelUpObjectAdapter<BN, ExecutedTransaction>
  trieDb: LevelUpObjectAdapter<Buffer, Buffer>

  constructor(options?: DatabaseOptions) {
    this._options = options || {}
  }

  async initialize() {
    let dataPath = this._options.dataPath

    if (!dataPath) {
      dataPath = await pify(dir)()
    }

    // This cache size was chosen from a plethora of hand testing.
    // It seems a not-too-large cache (100) size is the right amount.
    // When higher (say 10000), it seems the benefits wear off.
    // See /perf/transactions.js for a benchmark.
    let dbFactory;
    if (typeof this._options.db === 'function') {
      dbFactory = this._options.db;
    } else if (this._options.db && this._options.db.get) {
      let backingStore = this._options.db
      dbFactory = (location: string) => backingStore
    } else {
      //dbFactory = (location: string) => CacheDOWN(location, MedeaDOWN).maxSize(100)
      dbFactory = (location: string) => CacheDOWN(location, FileDOWN).maxSize(100)
    }
    

    this._db = await pify(LevelUp)(dataPath, { db: dbFactory })

    // Blocks, keyed by array index (not necessarily by block number) (0-based)
    this.blocksByNumber = new LevelUpArrayAdapter<ExecutedBlock>("blocks", this._db, executedBlockTransformer)

    // Logs triggered in each block, keyed by block id (ids in the blocks array; not necessarily block number) (0-based)
    this.logsByBlock = new LevelUpArrayAdapter<TransactionLog[]>("blockLogs", this._db, new ArrayTransformer(transactionLogTransformer))

    // Block hashes -> block ids (ids in the blocks array; not necessarily block number) for quick lookup
    this.blockHashes = new LevelUpObjectAdapter<BN, number>("blockHashes", this._db, new NullTransformer<number>(), bnTransformer )

    // Transaction hash -> transaction objects
    this.transactions = new LevelUpObjectAdapter<BN, ExecutedTransaction>("transactions", this._db, executedTransactionTransformer, bnTransformer)

    this.trieDb = new LevelUpObjectAdapter<Buffer, Buffer>("trie_db", this._db, bufferTransformer, bufferTransformer)
  }

  async close() {
    await this._db.close()
  }
}

export default Database
