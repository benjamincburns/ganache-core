import { BN } from 'bn.js'

/**
 * A plain object version of BN - use the helper functions below to rehydrate
 * into a proper BN object.
 */
export interface SerializedBN {
  words: number[]
  length: number
  negative: number
}

export function toBN(input: SerializedBN) : BN {
  let output = new BN([])

  output.words = input.words.slice()
  output.length = input.length
  output.negative = input.negative

  return output
}

export function toSerializedBN(input: BN) : SerializedBN {
  return {
    words: input.words.slice(),
    length: input.length,
    negative: input.negative
  }
}
