declare module 'ethereumjs-wallet/hdkey' {
  import BN from 'bn.js'
  import Wallet from 'ethereumjs-wallet'

  type LargeNumber = string | Buffer | BN

  export class EthereumHDKey {
    static fromMasterSeed(seedBuffer: Buffer): EthereumHDKey
    static fromExtendedKey(key: string): EthereumHDKey
    privateExtendedKey(): string
    publicExtendedKey(): string
    derivePath(path: string): EthereumHDKey
    deriveChild(index: string): EthereumHDKey
    getWallet(): Wallet
  }

  function fromHDKey(hdkey: any): EthereumHDKey

  export default EthereumHDKey
}
