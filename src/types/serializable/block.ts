import { BN } from 'bn.js'
import { SerializedBN, toBN, toSerializedBN } from './bn'
import { SignedTransaction, ExecutedTransaction } from '../transaction'
import {
  SerializedSignedTransaction,
  toSignedTransaction,
  toSerializedSignedTransaction,
  SerializedExecutedTransaction,
  toExecutedTransaction,
  toSerializedExecutedTransaction
} from './transaction'

import { PendingBlock, ExecutedBlock } from '../block'

export interface SerializedPendingBlock {
  number: number
  parentHash: SerializedBN | null
  nonce: SerializedBN | null
  transactionsRoot: SerializedBN
  stateRoot: SerializedBN
  receiptsRoot: SerializedBN
  miner: SerializedBN
  difficulty: SerializedBN
  totalDifficulty: SerializedBN
  extraData: SerializedBN
  gasLimit: SerializedBN
  timestamp: string
  transactions: SerializedSignedTransaction[]
}

export function toPendingBlock(input: SerializedPendingBlock): PendingBlock { 
  return new PendingBlock({
    number: input.number,
    parentHash: input.parentHash ? toBN(input.parentHash) : null,
    nonce: input.nonce ? toBN(input.nonce) : null,
    transactionsRoot: toBN(input.transactionsRoot),
    stateRoot: toBN(input.stateRoot),
    receiptsRoot: toBN(input.receiptsRoot),
    miner: toBN(input.miner),
    difficulty: toBN(input.difficulty),
    totalDifficulty: toBN(input.totalDifficulty),
    extraData: toBN(input.extraData),
    gasLimit: toBN(input.gasLimit),
    timestamp: new Date(input.timestamp),
    transactions: input.transactions.map(toSignedTransaction)
  })
}

export function toSerializedPendingBlock(input: PendingBlock): SerializedPendingBlock { 
  return {
    number: input.number,
    parentHash: input.parentHash ? toSerializedBN(input.parentHash) : null,
    nonce: input.nonce ? toSerializedBN(input.nonce) : null,
    transactionsRoot: toSerializedBN(input.transactionsRoot),
    stateRoot: toSerializedBN(input.stateRoot),
    receiptsRoot: toSerializedBN(input.receiptsRoot),
    miner: toSerializedBN(input.miner),
    difficulty: toSerializedBN(input.difficulty),
    totalDifficulty: toSerializedBN(input.totalDifficulty),
    extraData: toSerializedBN(input.extraData),
    gasLimit: toSerializedBN(input.gasLimit),
    timestamp: input.timestamp.toISOString(),
    transactions: input.transactions.map(toSerializedSignedTransaction)
  }
}

export interface SerializedExecutedBlock extends SerializedPendingBlock {
  transactions: SerializedExecutedTransaction[]
  uncleHashes: SerializedBN[]
}

export function toExecutedBlock(input: SerializedExecutedBlock): ExecutedBlock { 
  return new ExecutedBlock({
    number: input.number,
    parentHash: input.parentHash ? toBN(input.parentHash) : null,
    nonce: input.nonce ? toBN(input.nonce) : null,
    transactionsRoot: toBN(input.transactionsRoot),
    stateRoot: toBN(input.stateRoot),
    receiptsRoot: toBN(input.receiptsRoot),
    miner: toBN(input.miner),
    difficulty: toBN(input.difficulty),
    totalDifficulty: toBN(input.totalDifficulty),
    extraData: toBN(input.extraData),
    gasLimit: toBN(input.gasLimit),
    timestamp: new Date(input.timestamp),
    transactions: input.transactions.map(toExecutedTransaction),
    uncleHashes: input.uncleHashes.map(toBN)
  })
}

export function toSerializedExecutedBlock(input: ExecutedBlock): SerializedExecutedBlock { 
  return {
    number: input.number,
    parentHash: input.parentHash ? toSerializedBN(input.parentHash) : null,
    nonce: input.nonce ? toSerializedBN(input.nonce) : null,
    transactionsRoot: toSerializedBN(input.transactionsRoot),
    stateRoot: toSerializedBN(input.stateRoot),
    receiptsRoot: toSerializedBN(input.receiptsRoot),
    miner: toSerializedBN(input.miner),
    difficulty: toSerializedBN(input.difficulty),
    totalDifficulty: toSerializedBN(input.totalDifficulty),
    extraData: toSerializedBN(input.extraData),
    gasLimit: toSerializedBN(input.gasLimit),
    timestamp: input.timestamp.toISOString(),
    transactions: input.transactions.map(toSerializedExecutedTransaction),
    uncleHashes: input.uncleHashes.map(toSerializedBN)
  }
}
