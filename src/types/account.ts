import { Buffer } from 'buffer'
import { BN } from 'bn.js'

import Wallet from 'ethereumjs-wallet'
import HDKey from 'ethereumjs-wallet/hdkey'
import { privateToPublic, publicToAddress } from 'ethereumjs-util'

import { TransactionSignature, PendingTransaction, SignedTransaction, ITransactionSigner } from './transaction'
import { mnemonicToSeed } from 'bip39'

export interface IAccount {
  address: BN
  publicKey: BN
  privateKey: BN
  balance: BN
}

/**
 * An object which represents an ethereum account, used for signing transactions
 */
export class Account implements IAccount, ITransactionSigner {
  address: BN
  publicKey: BN
  privateKey: BN
  balance: BN

  constructor(account: IAccount) {
    this.address = account.address
    this.publicKey = account.publicKey
    this.privateKey = account.privateKey
    this.balance = account.balance
  }

  signTransaction(input: PendingTransaction) : TransactionSignature {
    let ejsTx = input.toEJSTransaction()
    ejsTx.sign(this.privateKey)
    return new TransactionSignature({
      v: new BN(ejsTx.v),
      r: new BN(ejsTx.r),
      s: new BN(ejsTx.s),
    })
  }

  static fromHDPath(seed: Seed, initialBalance : BN, index : number, privKey?: BN, hdPath: string = "m/44'/60'/0'/0/") : Account {
    let w = HDKey.fromMasterSeed(seed.seed.toArrayLike(Buffer))

    let privateKey: BN = new BN(privKey ?
      privKey.toArrayLike(Buffer) :
      w.derivePath(hdPath + index).getWallet().getPrivateKey())

    let publicKey: BN = new BN(privateToPublic(privateKey))
    let address: BN = new BN(publicToAddress(publicKey))

    return new Account ({
      address: new BN(address),
      privateKey,
      publicKey,
      balance: initialBalance
    })
  }
}

export interface ISeed {
  mnemonic?: string,
  seed: BN
}

export class Seed implements ISeed {
  mnemonic?: string
  seed: BN

  constructor(seed: string)
  constructor(seed: BN)
  constructor(seed: ISeed)
  constructor(seed: any) {
    if (typeof seed === 'string') {
      this._initMnemonicOnly(seed)
    } else if (seed instanceof BN) {
      this._initSeedOnly(seed)
    } else {
      this._initCopy(seed)
    }
  }

  private _initMnemonicOnly(mnemonic: string) {
    this.mnemonic = mnemonic
    this.seed = new BN(mnemonicToSeed(mnemonic))
  }

  private _initSeedOnly(seed: BN) {
    this.seed = seed
  }

  private _initCopy(seed: ISeed) {
    this.mnemonic = seed.mnemonic
    this.seed = seed.seed
  }
}
