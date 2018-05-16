import { BN } from 'bn.js'
import * as assert from 'assert'
import 'mocha'

import { SerializedBN, toBN, toSerializedBN } from '../../../../lib/types/serializable/bn'

describe('types/serializable/bn.ts', () => {
  let testBN: BN

  before('initialize testBN instance', () => {
    testBN = new BN(2)
  })

  describe('#toSerializedBN', () => {
    it('should create a SerializedBN correctly', () => {
      const serializedBN = toSerializedBN(testBN) as SerializedBN
      assert.deepEqual(serializedBN.words, testBN.words)
      assert.deepEqual(serializedBN.length, testBN.length)
      assert.deepEqual(serializedBN.negative, testBN.negative)
    })
  })

  describe('#toBN', () => {
    it ('should create a proper BN from a SerializedBN', () => {
      const serializedBN : SerializedBN = {
        words: testBN.words.slice(),
        negative: testBN.negative,
        length: testBN.length
      }

      let resultBN = toBN(serializedBN) as BN

      assert.equal(resultBN.toNumber(), testBN.toNumber())
      assert.equal(resultBN.add(testBN).toNumber(), testBN.add(testBN).toNumber())
    })
  })
})
