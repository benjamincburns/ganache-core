import { BN } from 'bn.js'
import { SerializedBN, toBN, toSerializedBN } from './bn'
import { Account, Seed } from '../account'

export interface SerializedAccount {
  address: SerializedBN
  publicKey: SerializedBN
  privateKey: SerializedBN
  balance: SerializedBN
}

export function toAccount(input: SerializedAccount) : Account {
  return new Account({
    address: toBN(input.address),
    publicKey: toBN(input.publicKey),
    privateKey: toBN(input.privateKey),
    balance: toBN(input.balance),
  })
}

export function toSerializedAccount(input: Account) : SerializedAccount {
  return {
    address: toSerializedBN(input.address),
    publicKey: toSerializedBN(input.publicKey),
    privateKey: toSerializedBN(input.privateKey),
    balance: toSerializedBN(input.balance)
  }
}

export interface SerializedSeed { 
  mnemonic?: string
  seed: SerializedBN
}

export function toSeed(input: SerializedSeed): Seed {
  return new Seed({
    ...(input.mnemonic &&  { mnemonic: input.mnemonic }),
    seed: toBN(input.seed)
  })
}

export function toSerializedSeed(input: Seed): SerializedSeed {
  return {
    ...(input.mnemonic &&  { mnemonic: input.mnemonic }),
    seed: toSerializedBN(input.seed)
  }
}
