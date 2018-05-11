import * as BN from 'bn.js'
import { ITransactionSignature, IPendingTransaction, ISignedTransaction } from './transaction'

/**
 * An object which represents an ethereum account, used for signing transactions
 */
export interface IAccount {
  address: BN.BN
  publicKey: BN.BN
  privateKey: BN.BN

  signTransaction(IPendingTransaction tx): ITransactionSignature
}
