import * as Sublevel from 'level-sublevel'
import * as LevelUp from 'levelup'
import * as pify from 'pify'

import { Callback, BidirectionalTransformer } from '../../types/functional'

export interface BatchOperation<KeyT, ValueT> {
  type: 'put' | 'del'
  key: KeyT
  value?: ValueT
}

export default class LevelUpObjectAdapter<KeyT, ValueT> {

  name: string
  private _db: Sublevel.Sublevel
  private _keySerializer: BidirectionalTransformer<KeyT, any>
  private _valueSerializer: BidirectionalTransformer<ValueT, any>

  constructor(
    name: string,
    db: LevelUp.LevelUp,
    valueSerializer: BidirectionalTransformer<ValueT, any>,
    keySerializer: BidirectionalTransformer<KeyT, any>,
  ) {
    this._db = Sublevel(db).sublevel(name)
    this.name = name
    this._keySerializer = keySerializer
    this._valueSerializer = valueSerializer
  }

  async get(key: KeyT, options?: any, callback?: Callback<ValueT>) {
    if (options instanceof Function) {
      callback = options
      options = {}
    }

    try {
      let encodedKey = this._encodeKey(key)

      let val = await pify(this._db.get)(encodedKey)
      let decodedValue = this._decodeValue(val)

      if (callback) {
        callback(null, decodedValue)
      }

      return val
    } catch (err) {
      if (callback) {
        callback(err)
      } else throw err
    }
  }

  async put(key: KeyT, value: ValueT, options?: any, callback?: Callback<never>) {
    if (options instanceof Function) {
      callback = options
      options = {}
    }

    try {
      let encodedKey = this._encodeKey(key)
      let encodedValue = this._encodeValue(value)
      await pify(this._db.put)(encodedKey, encodedValue)

      if (callback) {
        callback(null)
      }
    } catch (err) {
      if (callback) {
        callback(err)
      } else throw err
    }
  }

  async set(key: KeyT, value: ValueT, options?: any, callback?: Callback<never>) {
    await this.put(key, value, options, callback)
  }

  async del(key: KeyT, callback?: Callback<never>) {
    let encodedKey = this._encodeKey(key)
    try {
      await pify(this._db.del)(encodedKey)
      if (callback) {
        callback(null)
      }
    } catch (err) {
      if (callback) {
        callback(err)
      } else throw err
    }
  }

  isOpen() {
    return true
  }

  async batch(operations: BatchOperation<KeyT, ValueT>[], options: any, callback: Callback<never>) {
    await this._asyncBatch(operations, options)
      .then(() => callback(null))
      .catch((err) => callback(err))
  }

  private async _asyncBatch(operations: BatchOperation<KeyT, ValueT>[], options: any) {
    const _put = pify(this.put)
    const _del = pify(this.del)

    for (let operation of operations) {
      if (operation.type == "put") {
        await _put(operation.key, operation.value, options)
      } else if (operation.type == "del") {
        await _del(operation.key)
      } else {
        throw new Error("Unknown batch type " + operation.type)
      }
    }
  }

  private _encodeKey(key: KeyT) {
    return JSON.stringify(this._keySerializer.encode(key))
  }

  private _encodeValue(value: ValueT) {
    return JSON.stringify(this._valueSerializer.encode(value))
  }

  private _decodeValue(value: string) {
    return this._valueSerializer.decode(JSON.parse(value))
  }
}
