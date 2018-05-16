import { BN } from 'bn.js'
import { SerializedBN, toBN, toSerializedBN } from './bn'
import { Account } from '../account'

export interface SerializedAccount {
  address: SerializedBN
  publicKey: SerializedBN
  privateKey: SerializedBN
}

export function toAccount(input: SerializedAccount) : Account {
  return new Account({
    address: toBN(input.address),
    publicKey: toBN(input.publicKey),
    privateKey: toBN(input.privateKey)
  })
}

export function toSerializedAccount(input: Account) : SerializedAccount {
  return {
    address: toSerializedBN(input.address),
    publicKey: toSerializedBN(input.publicKey),
    privateKey: toSerializedBN(input.privateKey)
  }
}
