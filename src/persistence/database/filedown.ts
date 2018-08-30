import { AbstractLevelDOWN, Batch, AbstractChainedBatch } from 'abstract-leveldown'
import * as fs from 'fs'
import * as path from 'path'
import * as pify from 'pify'

export class FileDOWN<O=any, PO=any, GO=any, DO=any, IO=any, BO=any> extends AbstractLevelDOWN<string, string, O, PO, GO, DO, IO, BO> {

  _location: string
  constructor(location: string) {
    super(location)
    this._location = location
  }

  _put(key: string, value: string, callback: (err: any) => void): void;
  _put(key: string, value: string, options: PO, callback: (err: any) => void): void;
  _put(key: string, value: string, options: PO | ((err: any) => void), callback?: (err: any) => void) {
    if (!callback && typeof options === 'function') {
      callback = options
    }

    if (callback && typeof callback === 'function') {
      fs.writeFile(path.join(this._location, key), value, "utf8", callback)
    } else {
      throw new Error('callback must be defined and callable.')
    }
  }

  _get(key: string, callback: (err: any, value: string) => any): void;
  _get(key: string, options: GO, callback: (err: any, value: string) => any): void;
  _get(key: string, options: GO | ((err: any, value: string) => void), callback?: (err: any, value?: string) => void) {

    if (typeof options === 'function') {
      callback = options
    }

    if (!callback) {
      throw new Error('callback must be defined and callable.')
    }

    fs.readFile(path.join(this._location, key), "utf8", function(err, data) {
      // appease TypeScript
      if (callback) {
        if (err) {
          return callback(new Error("NotFound"))
        }
        callback(null, data)
      }
    })
  }

  _del(key: string, callback: (err: any) => any): void;
  _del(key: string, options: DO, callback: (err: any) => any): void;
  _del(key: string, options: DO | ((err: any) => void), callback?: (err: any) => void) {
    if (typeof options === 'function') {
      callback = options
    }

    fs.unlink(path.join(this._location, key), function(err) {
      // Ignore when we try to delete a file that doesn't exist.
      // I'm not sure why this happens. Worth looking into.
      if (callback) {
        if (err) {
          if (err.message.indexOf("ENOENT") >= 0) {
            return callback(null)
          } else {
            return callback(err)
          }
        }
        callback(null)
      }
    })
  }

  _batch(operations: Batch<string, string>[], options: BO, callback: (err: any) => any) {
    if (typeof options === 'function') {
      callback = options
    }

    this._asyncBatch(operations, options)
      .then(callback)
      .catch(callback)
  }

  private async _asyncBatch(operations: Batch<string, string>[], options: BO) {
    const _put = pify(this._put)
    const _del = pify(this._del)

    for (let operation of operations) {
      if (operation.type == "put") {
        await _put(operation.key, operation.value, options)
      } else if (operation.type == "del") {
        await _del(operation.key)
      } else {
        let unknownOperation: any = operation;
        throw new Error(`Unknown batch type '${unknownOperation.type}'`)
      }
    }
  }
}

export function filedown(location: string) {
  return new FileDOWN(location)
}

export default filedown
