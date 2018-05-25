declare module 'ethereumjs-tx/fake' {
  import { Transaction } from 'ethereumjs-tx'
  export class FakeTransaction extends Transaction { }
  export default FakeTransaction
}
