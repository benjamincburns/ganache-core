import * as LevelUp from 'levelup'
import * as Sublevel from 'level-sublevel'

import { Callback, BidirectionalTransformer } from '../../types/functional'

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

  length(callback: Callback<number>) {
    this._db.get("length", (err, result: number) => {
      if (err) {
        if (err.notFound) {
          return callback(null, 0)
        } else {
          return callback(err)
        }
      }

      callback(null, result)
    })
  }

  _get(key: number, callback: Callback<ValueT>) {
    var self = this
    this._db.get(key + "", (err, val) => {
      if (err) return callback(err)
      callback(null, self._serializer.decode(val))
    })
  }

  _put(key: number, value: ValueT, callback: Callback<never>) {
    let encoded = this._serializer.encode(value)
    this._db.put(key + "", encoded, callback)
  }

  get(index: number, callback: Callback<ValueT>) {
    var self = this

    this.length((err, length) => {
      if (err) return callback(err)

      if (length) {
        if (index >= length) {
          return callback(new Error("LevelUpArrayAdapter named '" + self._name + "' index out of range: index " + index + " length: " + length))
        }
        self._get(index, callback)
      } else {
        return callback(new Error("Bug! Callback called without error or value"))
      }
    })
  }

  push(val: ValueT, callback: Callback<never>) {
    var self = this
    this.length((err, length) => {
      if (err) return callback(err)

      if (length) {
        // TODO: Do this in atomic batch.
        self._put(length, val, (err) => {
          if (err) return callback(err)
          self._db.put("length", length + 1, callback)
        })
      } else {
        return callback(new Error("Bug! Callback called without error or value"))
      }
    })
  }

  pop(callback: Callback<ValueT>) {
    var self = this

    this.length((err, length) => {
      if (err) return callback(err)

      if (length) {
        var newLength = length - 1

        // TODO: Do this in atomic batch.
        self._get(newLength, (err, val) => {
          if (err) return callback(err)
          self._db.del(newLength, (err) => {
            if (err) return callback(err)
            self._db.put("length", newLength,(err) => {
              if (err) return callback(err)

              callback(null, val)
            })
          })
        })
      } else {
        return callback(new Error("Bug! Callback called without error or value"))
      }
    })
  }

  last(callback: Callback<ValueT | null>) {
    var self = this
    this.length((err, length) => {
      if (err) return callback(err)

      if (length) {
        if (length == 0) return callback(null, null)

        self._get((length - 1), callback)
      } else {
        return callback(new Error("Bug! Callback called without error or value"))
      }
    })
  }

  first(callback: Callback<ValueT>) {
    this._get(0, callback)
  }
}
