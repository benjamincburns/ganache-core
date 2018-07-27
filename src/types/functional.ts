// note: where you have the choice, use an async function instead of a callback!
export type Callback<T> = (err: Error | null, result?: T) => void

export type Transformer<T, U> = (input: T) => U

export interface BidirectionalTransformer<T, U> {
  encode(input: T): U
  decode(input: U): T
}

