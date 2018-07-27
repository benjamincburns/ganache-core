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


  get(key: KeyT, options: any, callback: Callback<ValueT>) {
    var self = this

    if (options instanceof Function) {
      callback = options
      options = {}
    }

    let encodedKey = this._keySerializer.encode(key)

    self._db.get(encodedKey, (err, val) => {
      if (err) return callback(err)

      let decodedValue = self._valueSerializer.decode(val)

      callback(null, decodedValue)
    })
  }

  put(key: KeyT, value: ValueT, options: any, callback: Callback<never>) {
    var self = this

    if (options instanceof Function) {
      callback = options
      options = {}
    }

    let encodedKey = this._keySerializer.encode(key)
    let encodedValue = self._valueSerializer.encode(value)
    self._db.put(encodedKey, encodedValue, callback)
  }

  set(key: KeyT, value: ValueT, options: any, callback: Callback<never>) {
    this.put(key, value, options, callback)
  }

  del(key: KeyT, callback: Callback<never>) {
    var self = this

    let encodedKey = this._keySerializer.encode(key)
    self._db.del(encodedKey, callback)
  }

  isOpen() {
    return true
  }

  batch(operations: BatchOperation<KeyT, ValueT>[], options: any, callback: Callback<never>) {
    this._asyncBatch(operations, options)
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
}
