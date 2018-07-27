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
    db = new Database({db: memdown})
    await db.initialize()
  })

  afterEach('tear down database', async () => {
    await db.close()
  })

  describe('#blocksByNumber', () => {
    it('should store multiple blocks', async () => {
      await db.blocksByNumber.push(testExecutedBlock)
      let length = await db.blocksByNumber.length()
      assert.deepEqual(length, 1)

      await db.blocksByNumber.push(testExecutedBlock)
      length = await db.blocksByNumber.length()
      assert.deepEqual(length, 2)

      let blk = await db.blocksByNumber.last()
      assert.deepEqual(blk, testExecutedBlock)
    })
  })

  describe('#logsByBlock', () => {
    it('should store multiple log entries', async () => {
      await db.logsByBlock.push([testTransactionLog, testTransactionLog])
      let length = await db.logsByBlock.length()
      assert.deepEqual(length, 1)

      await db.logsByBlock.push([testTransactionLog, testTransactionLog, testTransactionLog])
      length = await db.logsByBlock.length()
      assert.deepEqual(length, 2)

      let logs = await db.logsByBlock.last()
      assert(logs)

      if (logs) { // make typescript happy
        assert.deepEqual(logs.length, 3)
        if (logs && logs.length > 0) {  // make typescript happy
          assert.deepEqual(logs[0], testTransactionLog)
        }
      }
    })
  })

  describe('#blockHashes', () => {
    it('should error when a block hash has no entry', async () => {
      try {
        await db.blockHashes.get(new BN(1))
        assert.fail("Promise didn't reject: expected NotFoundError")
      } catch (err) {
        assert(err.notFound, 'Expected NotFoundError')
      }
    })

    it('should store multiple block hash index mappings', async () => {
      await db.blockHashes.put(new BN(1), 1)
      await db.blockHashes.put(new BN(2), 2)
      await db.blockHashes.put(new BN(3), 3)

      let one = await db.blockHashes.get(new BN(1))
      let two = await db.blockHashes.get(new BN(2))
      let three = await db.blockHashes.get(new BN(3))

      assert.deepEqual(one, 1)
      assert.deepEqual(two, 2)
      assert.deepEqual(three, 3)
    })
  })

})
