import { BN } from 'bn.js'
import { TransactionSignature, PendingTransaction, SignedTransaction, ITransactionSigner } from './transaction'

export interface IAccount {
  address: BN
  publicKey: BN
  privateKey: BN
}

/**
 * An object which represents an ethereum account, used for signing transactions
 */
export class Account implements IAccount, ITransactionSigner {
  address: BN
  publicKey: BN
  privateKey: BN

  constructor(account: IAccount) {
    this.address = account.address
    this.publicKey = account.publicKey
    this.privateKey = account.privateKey
  }

  signTransaction(input: PendingTransaction) : TransactionSignature {
    return {
      v: new BN(1),
      r: new BN(2),
      s: new BN(3)
    }
  }
}
