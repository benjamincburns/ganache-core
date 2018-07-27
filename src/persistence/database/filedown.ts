/*import { AbstractLevelDOWN, Batch, AbstractChainedBatch } from 'abstract-leveldown'
import * as fs from 'fs'
import * as path from 'path'

export class FileDown<O=any, PO=any, GO=any, DO=any, IO=any, BO=any> extends AbstractLevelDOWN<string, string, O, PO, GO, DO, IO, BO> {

  _location: string
  constructor(location: string) {
    super(location)
    this._location = location
  }

  open(callback:(err?: any) => void): void;
  open(options: O, callback: (err?: any) => void): void;
  open(options: O | ((err?: any) => void), callback?: (err?: any) => void) {
    if (typeof options === 'function') {
      callback = options
    }

    if (callback) {
      callback(null)
    }
  }

  put(key: string, value: string, callback: (err: any) => any): void;
  put(key: string, value: string, options: PO, callback: (err: any) => any): void;
  put(key: string, value: string, options: PO | ((err: any) => void), callback?: (err: any) => void) {
    if (!callback && typeof options === 'function') {
      callback = options
    }

    if (callback && typeof callback === 'function') {
      fs.writeFile(path.join(this._location, key), value, "utf8", callback)
    } else {
      throw new Error('callback must be defined and callable.')
    }
  }

  get(key: string, callback: (err: any, value: string) => any): void;
  get(key: string, options: GO, callback: (err: any, value: string) => any): void;
  get(key: string, options: GO | ((err: any, value: string) => void), callback?: (err: any, value?: string) => void) {

    if (typeof options === 'function') {
      callback = options
    }

    if (!callback) {
      throw new Error('callback must be defined and callable.')
    }

    fs.readFile(path.join(this._location, key), "utf8", function(err, data) {
      // stupid unnecessary conditional to appease TypeScript
      if (callback) {
        if (err) {
          return callback(new Error("NotFound"))
        }
        callback(null, data)
      }
    })
  }

  del(key: string, callback: (err: any) => any): void;
  del(key: string, options: DO, callback: (err: any) => any): void;
  del(key: string, options: DO | ((err: any) => void), callback: (err: any) => void) {
    fs.unlink(path.join(this._location, key), function(err) {
      // Ignore when we try to delete a file that doesn't exist.
      // I'm not sure why this happens. Worth looking into.
      if (err) {
        if (err.message.indexOf("ENOENT") >= 0) {
          return callback()
        } else {
          return callback(err)
        }
      }
      callback()
    })
  }

  batch(): AbstractChainedBatch<string, string, BO>;
  batch(array: Batch<string, string>[], callback: (err: any) => any): AbstractChainedBatch<string, string, BO>;
  batch(array: Batch<string, string>[], options: BO, callback: (err: any) => any): AbstractChainedBatch<string, string, BO>;
  batch(array: Batch<string, string>[], options: BO, callback: (err: any) => any): AbstractChainedBatch<string, string, BO> {
    this._asyncBatch(operations, options)
      .then(callback)
      .catch(callback)
  }

  private async _asyncBatch(operations: BatchOperation[], options: BO) {
    const _put = pify(this.put)
    const _del = pify(this.del)

    for (let operation of operations) {
      if (item.type == "put") {
        await _put(item.key, item.value, options)
      } else if (item.type == "del") {
        await _del(item.key, finished)
      } else {
        throw new Error("Unknown batch type", item.type)
      }
    }
  }
}
*/
