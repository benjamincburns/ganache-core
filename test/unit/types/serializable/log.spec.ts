import { BN } from 'bn.js'
import * as assert from 'assert'
import 'mocha'

import { SerializedBN, toBN, toSerializedBN } from '../../../../lib/types/serializable/bn'

import { TransactionLog } from '../../../../lib/types/log'

import {
  SerializedTransactionLog,
  toTransactionLog,
  toSerializedTransactionLog
} from '../../../../lib/types/serializable/log'

describe('types/serializable/log.ts', () => {

  let testTransactionLog : TransactionLog = new TransactionLog({
    removed: true,
    originatingAddress: new BN(1),
    data: new BN(2),
    topics: [new BN(3)],
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
})

