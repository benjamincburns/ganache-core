import { BN } from 'bn.js'
import * as assert from 'assert'
import 'mocha'

import { toSerializedBN, toBN } from '../../../../lib/types/serializable/bn'

import {
  SerializedAccount,
  toAccount,
  toSerializedAccount
} from '../../../../lib/types/serializable/account'

import { Account } from '../../../../lib/types/account'

describe('types/serializable/account.ts', () => {
  let testAccount = new Account({
    address: new BN(1),
    publicKey: new BN(2),
    privateKey: new BN(3),
    balance: new BN(4)
  })

  describe('#toAccount', () => {
    it('should create an Account correctly from a SerializedAccount', () => {
      const serializedAccount : SerializedAccount = {
        address: toSerializedBN(new BN(1)),
        publicKey: toSerializedBN(new BN(2)),
        privateKey: toSerializedBN(new BN(3)),
        balance: toSerializedBN(new BN(4))
      }

      let resultAccount = toAccount(serializedAccount)
      assert.deepEqual(resultAccount, testAccount)
    })
  })

  describe('#toSerializedAccount', () => {
    it('should create a SerializedAccount correctly from an Account', () => {
      const serializedAccount = toSerializedAccount(testAccount)

      assert.deepEqual(toBN(serializedAccount.address), testAccount.address)
      assert.deepEqual(toBN(serializedAccount.publicKey), testAccount.publicKey)
      assert.deepEqual(toBN(serializedAccount.privateKey), testAccount.privateKey)
      assert.deepEqual(toBN(serializedAccount.balance), testAccount.balance)
    })
  })
})
