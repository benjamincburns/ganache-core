import * as assert from 'assert'
import 'mocha'

import memdown from 'memdown'

import { Database, DatabaseOptions } from '../../../lib/persistence/database'

import { BN } from 'bn.js'

import { ExecutedBlock } from '../../../lib/types/block'
import { TransactionLog } from '../../../lib/types/log'

import {
  TransactionSignature,
  ExecutedTransaction
} from '../../../lib/types/transaction'

let testExecutedBlock = new ExecutedBlock({
  number: 1,
  parentHash: new BN(1),
  nonce: new BN(2),
  transactionsRoot: new BN(3),
  stateRoot: new BN(4),
  receiptsRoot: new BN(5),
  miner: new BN(6),
  difficulty: new BN(7),
  totalDifficulty: new BN(8),
  extraData: new BN(9),
  gasLimit: new BN(10),
  timestamp: new Date('January 1, 1970 11:00:00'),
  transactions: [],
  uncleHashes: [new BN(11)]
})

let testTransactionLog : TransactionLog = new TransactionLog({
  removed: true,
  originatingAddress: new BN(1),
  data: new BN(2),
  topics: [new BN(3)],
})

let testTransactionSignature : TransactionSignature = new TransactionSignature({
  v: new BN(1),
  r: new BN(2),
  s: new BN(3)
})

let testExecutedTransaction : ExecutedTransaction = new ExecutedTransaction({
  nonce: new BN(1),
  from: new BN(2),
  to: new BN(3),
  value: new BN(4),
  gasPrice: new BN(5),
  gasLimit: new BN(6),
  data: new BN(7),
  signature: testTransactionSignature,
  cumulativeGasUsed: new BN(8),
  gasUsed: new BN(9),
  contractAddress: new BN(10),
  logs: [ testTransactionLog ],
  logsBloom: new BN(11),
  executedSuccessfully: true
})

let db: Database;

describe('persistence/database.ts', () => {

  beforeEach('initialize database', async () => {
    db = new Database()
    await db.initialize()
  })

  afterEach('tear down database', async () => {
    await db.close()
  })

  describe('#blocksByNumber', () => {
    it('should store a block', async () => {
      await db.blocksByNumber.push(testExecutedBlock)
      let length = await db.blocksByNumber.length()
      assert.deepEqual(length, 1)
      let blk = await db.blocksByNumber.last()
      console.log(JSON.stringify(blk, null, 2))
      assert.deepEqual(blk, testExecutedBlock)
    })
  })

})
