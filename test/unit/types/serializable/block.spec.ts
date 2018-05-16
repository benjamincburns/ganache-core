import { BN } from 'bn.js'
import * as assert from 'assert'
import 'mocha'

import { toSerializedBN, toBN } from '../../../../lib/types/serializable/bn'

import {
  SerializedPendingBlock,
  toPendingBlock,
  toSerializedPendingBlock,

  SerializedExecutedBlock,
  toExecutedBlock,
  toSerializedExecutedBlock
} from '../../../../lib/types/serializable/block'

import {
  PendingBlock,
  ExecutedBlock
} from '../../../../lib/types/block'

import {
  toSignedTransaction,
  toSerializedSignedTransaction,
  toExecutedTransaction,
  toSerializedExecutedTransaction
} from '../../../../lib/types/serializable/transaction'

describe('types/serializable/block.ts', () => {
  let testPendingBlock = new PendingBlock({
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
    timestamp: new Date('January 1, 1970 00:00:01'),
    transactions: []
  })

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
    timestamp: new Date('January 1, 1970 00:00:01'),
    transactions: [],
    uncleHashes: [new BN(11)]
  })

  describe('#toSerializedPendingBlock', () => {
    it('should create a SerializedPendingBlock correctly', () => {
      const serializedBlock = toSerializedPendingBlock(testPendingBlock)
      assert.deepEqual(serializedBlock.number, testPendingBlock.number)
      assert.deepEqual(toBN(<BN>serializedBlock.parentHash), testPendingBlock.parentHash)
      assert.deepEqual(toBN(<BN>serializedBlock.nonce), testPendingBlock.nonce)
      assert.deepEqual(toBN(<BN>serializedBlock.transactionsRoot), testPendingBlock.transactionsRoot)
      assert.deepEqual(toBN(<BN>serializedBlock.stateRoot), testPendingBlock.stateRoot)
      assert.deepEqual(toBN(<BN>serializedBlock.receiptsRoot), testPendingBlock.receiptsRoot)
      assert.deepEqual(toBN(<BN>serializedBlock.miner), testPendingBlock.miner)
      assert.deepEqual(toBN(<BN>serializedBlock.difficulty), testPendingBlock.difficulty)
      assert.deepEqual(toBN(<BN>serializedBlock.totalDifficulty), testPendingBlock.totalDifficulty)
      assert.deepEqual(toBN(<BN>serializedBlock.extraData), testPendingBlock.extraData)
      assert.deepEqual(toBN(<BN>serializedBlock.gasLimit), testPendingBlock.gasLimit)
      assert.deepEqual(serializedBlock.timestamp, testPendingBlock.timestamp)
      assert.deepEqual(serializedBlock.transactions.map(toSignedTransaction), testPendingBlock.transactions)
    })
  })

  describe('#toPendingBlock', () => {
    it ('should create a proper PendingBlock from a SerializedPendingBlock', () => {
      const serializedPendingBlock : SerializedPendingBlock = {
        number: 1,
        parentHash: toSerializedBN(new BN(1)),
        nonce: toSerializedBN(new BN(2)),
        transactionsRoot: toSerializedBN(new BN(3)),
        stateRoot: toSerializedBN(new BN(4)),
        receiptsRoot: toSerializedBN(new BN(5)),
        miner: toSerializedBN(new BN(6)),
        difficulty: toSerializedBN(new BN(7)),
        totalDifficulty: toSerializedBN(new BN(8)),
        extraData: toSerializedBN(new BN(9)),
        gasLimit: toSerializedBN(new BN(10)),
        timestamp: new Date('January 1, 1970 00:00:01'),
        transactions: []
      }

      let resultBlock = toPendingBlock(serializedPendingBlock)
      assert.deepEqual(resultBlock, testPendingBlock)
    })
  })

  describe('#toSerializedExecutedBlock', () => {
    it('should create a SerializedExecutedBlock correctly', () => {
      const serializedBlock = toSerializedExecutedBlock(testExecutedBlock)
      assert.deepEqual(serializedBlock.number, testExecutedBlock.number)
      assert.deepEqual(toBN(<BN>serializedBlock.parentHash), testExecutedBlock.parentHash)
      assert.deepEqual(toBN(<BN>serializedBlock.nonce), testExecutedBlock.nonce)
      assert.deepEqual(toBN(<BN>serializedBlock.transactionsRoot), testExecutedBlock.transactionsRoot)
      assert.deepEqual(toBN(<BN>serializedBlock.stateRoot), testExecutedBlock.stateRoot)
      assert.deepEqual(toBN(<BN>serializedBlock.receiptsRoot), testExecutedBlock.receiptsRoot)
      assert.deepEqual(toBN(<BN>serializedBlock.miner), testExecutedBlock.miner)
      assert.deepEqual(toBN(<BN>serializedBlock.difficulty), testExecutedBlock.difficulty)
      assert.deepEqual(toBN(<BN>serializedBlock.totalDifficulty), testExecutedBlock.totalDifficulty)
      assert.deepEqual(toBN(<BN>serializedBlock.extraData), testExecutedBlock.extraData)
      assert.deepEqual(toBN(<BN>serializedBlock.gasLimit), testExecutedBlock.gasLimit)
      assert.deepEqual(serializedBlock.timestamp, testExecutedBlock.timestamp)
      assert.deepEqual(serializedBlock.transactions.map(toExecutedTransaction), testExecutedBlock.transactions)
      assert.deepEqual(serializedBlock.uncleHashes.map(toBN), testExecutedBlock.uncleHashes)
    })
  })

  describe('#toExecutedBlock', () => {
    it ('should create a proper ExecutedBlock from a SerializedExecutedBlock', () => {
      const serializedExecutedBlock : SerializedExecutedBlock = {
        number: 1,
        parentHash: toSerializedBN(new BN(1)),
        nonce: toSerializedBN(new BN(2)),
        transactionsRoot: toSerializedBN(new BN(3)),
        stateRoot: toSerializedBN(new BN(4)),
        receiptsRoot: toSerializedBN(new BN(5)),
        miner: toSerializedBN(new BN(6)),
        difficulty: toSerializedBN(new BN(7)),
        totalDifficulty: toSerializedBN(new BN(8)),
        extraData: toSerializedBN(new BN(9)),
        gasLimit: toSerializedBN(new BN(10)),
        timestamp: new Date('January 1, 1970 00:00:01'),
        transactions: [],
        uncleHashes: [ new BN(11) ]
      }

      let resultBlock = toExecutedBlock(serializedExecutedBlock)
      assert.deepEqual(resultBlock, testExecutedBlock)
    })
  })
})
