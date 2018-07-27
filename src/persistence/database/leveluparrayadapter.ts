import * as LevelUp from 'levelup'
import * as Sublevel from 'level-sublevel'
import * as pify from 'pify'

import { BidirectionalTransformer } from '../../types/functional'

// Level up adapter that looks like an array. Doesn't support inserts.

export default class LevelUpArrayAdapter<ValueT> {
  private _db: Sublevel.Sublevel
  private _serializer: BidirectionalTransformer<ValueT, any>
  private _name: string

  constructor(
    name: string,
    db: LevelUp.LevelUp,
    serializer: BidirectionalTransformer<ValueT, any>,
  ) {
    this._db = Sublevel(db).sublevel(name)
    this._name = name
    this._serializer = serializer
  }

  async length() {
    try {
      let val = await pify(this._db.get)("length")
      return parseInt(val as string)
    } catch (err) {
      if (err.notFound) {
        return 0
      } else throw err
    }
  }

  async _get(key: number) {
    return this._serializer.decode(
      JSON.parse(
        await pify(this._db.get)(key + "")
      )
    )
  }

  async _put(key: number, value: ValueT) {
    let encoded = JSON.stringify(this._serializer.encode(value))
    return await pify(this._db.put)(key + "", encoded)
  }

  async get(index: number) {
    let length = await this.length()

    if (index >= length) {
      throw new Error("LevelUpArrayAdapter named '" + this._name + "' index out of range: index " + index + " length: " + length)
    }

    return await this._get(index)
  }

  async push(val: ValueT) {
    let length = await this.length()

    // TODO: Do this in atomic batch.
    await this._put(length, val)
    await pify(this._db.put)("length", length + 1)
  }

  async pop() {
    let length = await this.length()
    var newLength = length - 1

    // TODO: Do this in atomic batch.
    let val = await this._get(newLength)
    await pify(this._db.del)(newLength)
    await pify(this._db.put)("length", newLength)
    return val
  }

  async last() {
    let length = await this.length()
    if (length > 0) {
      return await this._get((length - 1))
    }
  }

  async first() {
    return await this._get(0)
  }
}
