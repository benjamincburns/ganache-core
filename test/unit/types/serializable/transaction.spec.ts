import { BN } from 'bn.js'
import * as assert from 'assert'
import 'mocha'

import { SerializedBN, toBN, toSerializedBN } from '../../../../lib/types/serializable/bn'

import {
  TransactionSignature,
  TransactionLog,
  PendingTransaction,
  SignedTransaction,
  ExecutedTransaction
} from '../../../../lib/types/transaction'

import {
  SerializedTransactionSignature,
  toTransactionSignature,
  toSerializedTransactionSignature,

  SerializedTransactionLog,
  toTransactionLog,
  toSerializedTransactionLog,

  SerializedPendingTransaction,
  toPendingTransaction,
  toSerializedPendingTransaction,

  SerializedSignedTransaction,
  toSignedTransaction,
  toSerializedSignedTransaction,

  SerializedExecutedTransaction,
  toExecutedTransaction,
  toSerializedExecutedTransaction
} from '../../../../lib/types/serializable/transaction'

describe('types/serializable/transaction.ts', () => {
  let testTransactionSignature : TransactionSignature = new TransactionSignature({
    v: new BN(1),
    r: new BN(2),
    s: new BN(3)
  })

  let testTransactionLog : TransactionLog = new TransactionLog({
    removed: true,
    originatingAddress: new BN(1),
    data: new BN(2),
    topics: [new BN(3)],
  })

  let testPendingTransaction : PendingTransaction = new PendingTransaction({
    nonce: 1234,
    from: new BN(1),
    to: new BN(2),
    value: new BN(3),
    gasPrice: new BN(4),
    gas: new BN(5),
    input: new BN(6)
  })

  let testSignedTransaction : SignedTransaction = new SignedTransaction(testPendingTransaction, testTransactionSignature)

  let testExecutedTransaction : ExecutedTransaction = new ExecutedTransaction({
    nonce: testSignedTransaction.nonce,
    from: testSignedTransaction.from,
    to: testSignedTransaction.to,
    value: testSignedTransaction.value,
    gasPrice: testSignedTransaction.gasPrice,
    gas: testSignedTransaction.gas,
    input: testSignedTransaction.input,
    signature: testSignedTransaction.signature,
    cumulativeGasUsed: new BN(1),
    gasUsed: new BN(2),
    contractAddress: new BN(3),
    logs: [ testTransactionLog ],
    logsBloom: new BN(4),
    executedSuccessfully: true
  })

  describe('#toSerializedTransactionSignature', () => {
    it('should create a SerializedTransactionSignature correctly', () => {
      const serializedTransactionSignature = toSerializedTransactionSignature(testTransactionSignature)
      assert.deepEqual(toBN(serializedTransactionSignature.v), testTransactionSignature.v)
      assert.deepEqual(toBN(serializedTransactionSignature.r), testTransactionSignature.r)
      assert.deepEqual(toBN(serializedTransactionSignature.s), testTransactionSignature.s)
    })
  })

  describe('#toTransactionSignature', () => {
    it ('should create a proper TransactionSignature from a SerializedTransactionSignature', () => {
      const serializedTransactionSignature : SerializedTransactionSignature = {
        v: toSerializedBN(new BN(1)),
        r: toSerializedBN(new BN(2)),
        s: toSerializedBN(new BN(3))
      }

      let resultTransactionSignature : TransactionSignature = toTransactionSignature(serializedTransactionSignature)

      assert.deepEqual(resultTransactionSignature, testTransactionSignature)
    })
  })

  describe('#toSerializedTransactionLog', () => {
    it('should create a SerializedTransactionLog correctly', () => {
      const serializedTransactionLog = toSerializedTransactionLog(testTransactionLog)
      assert.deepEqual(serializedTransactionLog.removed, testTransactionLog.removed)
      assert.deepEqual(toBN(serializedTransactionLog.originatingAddress), testTransactionLog.originatingAddress)
      assert.deepEqual(toBN(serializedTransactionLog.data), testTransactionLog.data)
      assert.deepEqual(serializedTransactionLog.topics.map(toBN), testTransactionLog.topics)
    })
  })

  describe('#toTransactionLog', () => {
    it ('should create a proper TransactionLog from a SerializedTransactionLog', () => {
      const serializedTransactionLog : SerializedTransactionLog = {
        removed: true,
        originatingAddress: toSerializedBN(new BN(1)),
        data: toSerializedBN(new BN(2)),
        topics: [toSerializedBN(new BN(3))]
      }

      let resultTransactionLog : TransactionLog = toTransactionLog(serializedTransactionLog)

      assert.deepEqual(resultTransactionLog, testTransactionLog)
    })
  })

  describe('#toSerializedPendingTransaction', () => {
    it('should create a SerializedPendingTransaction correctly', () => {
      const serializedPendingTransaction = toSerializedPendingTransaction(testPendingTransaction)
      assert.deepEqual(toBN(serializedPendingTransaction.from), testPendingTransaction.from)
      assert.deepEqual(toBN(serializedPendingTransaction.to), testPendingTransaction.to)
      assert.deepEqual(toBN(serializedPendingTransaction.value), testPendingTransaction.value)
      assert.deepEqual(toBN(serializedPendingTransaction.gasPrice), testPendingTransaction.gasPrice)
      assert.deepEqual(toBN(serializedPendingTransaction.gas), testPendingTransaction.gas)
      assert.deepEqual(toBN(serializedPendingTransaction.input), testPendingTransaction.input)
    })
  })

  describe('#toPendingTransaction', () => {
    it ('should create a proper PendingTransaction from a SerializedPendingTransaction', () => {
      const serializedPendingTransaction : SerializedPendingTransaction = {
        nonce: 1234,
        from: toSerializedBN(new BN(1)),
        to: toSerializedBN(new BN(2)),
        value: toSerializedBN(new BN(3)),
        gasPrice: toSerializedBN(new BN(4)),
        gas: toSerializedBN(new BN(5)),
        input: toSerializedBN(new BN(6))
      }

      let resultPendingTransaction : PendingTransaction = toPendingTransaction(serializedPendingTransaction)

      assert.deepEqual(resultPendingTransaction, testPendingTransaction)
    })
  })

  describe('#toSerializedSignedTransaction', () => {
    it('should create a SerializedSignedTransaction correctly', () => {
      const serializedSignedTransaction = toSerializedSignedTransaction(testSignedTransaction)
      assert.deepEqual(toBN(serializedSignedTransaction.from), testSignedTransaction.from)
      assert.deepEqual(toBN(serializedSignedTransaction.to), testSignedTransaction.to)
      assert.deepEqual(toBN(serializedSignedTransaction.value), testSignedTransaction.value)
      assert.deepEqual(toBN(serializedSignedTransaction.gasPrice), testSignedTransaction.gasPrice)
      assert.deepEqual(toBN(serializedSignedTransaction.gas), testSignedTransaction.gas)
      assert.deepEqual(toBN(serializedSignedTransaction.input), testSignedTransaction.input)
      assert.deepEqual(toBN(serializedSignedTransaction.signature.v), testSignedTransaction.signature.v)
      assert.deepEqual(toBN(serializedSignedTransaction.signature.r), testSignedTransaction.signature.r)
      assert.deepEqual(toBN(serializedSignedTransaction.signature.s), testSignedTransaction.signature.s)
    })
  })

  describe('#toSignedTransaction', () => {
    it ('should create a proper SignedTransaction from a SerializedSignedTransaction', () => {
      const serializedSignedTransaction : SerializedSignedTransaction = {
        nonce: 1234,
        from: toSerializedBN(new BN(1)),
        to: toSerializedBN(new BN(2)),
        value: toSerializedBN(new BN(3)),
        gasPrice: toSerializedBN(new BN(4)),
        gas: toSerializedBN(new BN(5)),
        input: toSerializedBN(new BN(6)),
        signature: {
          v: toSerializedBN(new BN(1)),
          r: toSerializedBN(new BN(2)),
          s: toSerializedBN(new BN(3))
        }
      }

      let resultSignedTransaction : SignedTransaction = toSignedTransaction(serializedSignedTransaction)

      assert.deepEqual(resultSignedTransaction, testSignedTransaction)
    })
  })

  describe('#toSerializedExecutedTransaction', () => {
    it('should create a SerializedExecutedTransaction correctly', () => {
      const serializedExecutedTransaction = toSerializedExecutedTransaction(testExecutedTransaction)
      assert.deepEqual(toBN(serializedExecutedTransaction.from), testExecutedTransaction.from)
      assert.deepEqual(toBN(serializedExecutedTransaction.to), testExecutedTransaction.to)
      assert.deepEqual(toBN(serializedExecutedTransaction.value), testExecutedTransaction.value)
      assert.deepEqual(toBN(serializedExecutedTransaction.gasPrice), testExecutedTransaction.gasPrice)
      assert.deepEqual(toBN(serializedExecutedTransaction.gas), testExecutedTransaction.gas)
      assert.deepEqual(toBN(serializedExecutedTransaction.input), testExecutedTransaction.input)
      assert.deepEqual(toBN(serializedExecutedTransaction.signature.v), testExecutedTransaction.signature.v)
      assert.deepEqual(toBN(serializedExecutedTransaction.signature.r), testExecutedTransaction.signature.r)
      assert.deepEqual(toBN(serializedExecutedTransaction.signature.s), testExecutedTransaction.signature.s)
      assert.deepEqual(toBN(serializedExecutedTransaction.cumulativeGasUsed), testExecutedTransaction.cumulativeGasUsed)
      assert.deepEqual(toBN(serializedExecutedTransaction.gasUsed), testExecutedTransaction.gasUsed)
      assert.deepEqual(toBN(<BN>serializedExecutedTransaction.contractAddress), testExecutedTransaction.contractAddress)
      assert.deepEqual(serializedExecutedTransaction.logs.map(toTransactionLog), testExecutedTransaction.logs)
      assert.deepEqual(toBN(serializedExecutedTransaction.logsBloom), testExecutedTransaction.logsBloom)
      assert.deepEqual(serializedExecutedTransaction.executedSuccessfully, testExecutedTransaction.executedSuccessfully)
    })
  })

  describe('#toExecutedTransaction', () => {
    it ('should create a proper ExecutedTransaction from a SerializedExecutedTransaction', () => {
      const serializedExecutedTransaction : SerializedExecutedTransaction = {
        nonce: 1234,
        from: toSerializedBN(new BN(1)),
        to: toSerializedBN(new BN(2)),
        value: toSerializedBN(new BN(3)),
        gasPrice: toSerializedBN(new BN(4)),
        gas: toSerializedBN(new BN(5)),
        input: toSerializedBN(new BN(6)),
        signature: {
          v: toSerializedBN(new BN(1)),
          r: toSerializedBN(new BN(2)),
          s: toSerializedBN(new BN(3))
        },
        cumulativeGasUsed: toSerializedBN(new BN(1)),
        gasUsed: toSerializedBN(new BN(2)),
        contractAddress: toSerializedBN(new BN(3)),
        logs: [ testTransactionLog ],
        logsBloom: toSerializedBN(new BN(4)),
        executedSuccessfully: true
      }

      let resultExecutedTransaction : ExecutedTransaction = toExecutedTransaction(serializedExecutedTransaction)

      assert.deepEqual(resultExecutedTransaction, testExecutedTransaction)
    })
  })
})
