/// <reference types="node" />

declare module 'levelup' {
  import { AbstractLevelDOWN } from 'abstract-leveldown'

  export = levelup;

  var levelup: levelup.LevelUpConstructor;

  namespace levelup {
    interface CustomEncoding {
      encode(val: any): Buffer| string;
      decode(val: Buffer | string): any;
      buffer: boolean;
      type: string;
    }

    type Encoding = string | CustomEncoding;

    interface Batch {
      type: string;
      key: any;
      value?: any;
      keyEncoding?: Encoding;
      valueEncoding?: Encoding;
    }

    interface LevelUpBase<BatchType extends Batch> {
      open(callback ?: (error : any) => any): void;
      close(callback ?: (error : any) => any): void;
      put(key: any, value: any, callback ?: (error: any) => any): void;
      put(key: any, value: any, options?: { sync?: boolean }, callback ?: (error: any) => any): void;
      get(key: any, callback ?: (error: any, value: any) => any): void;

      get(key: any, options ?: { keyEncoding?: Encoding; fillCache?: boolean }, callback ?: (error: any, value: any) => any): void;
      del(key: any, callback ?: (error: any) => any): void;
      del(key: any, options ?: { keyEncoding?: Encoding; sync?: boolean }, callback ?: (error: any) => any): void;


      batch(array: BatchType[], options?: { keyEncoding?: Encoding; valueEncoding?: Encoding; sync?: boolean }, callback?: (error?: any)=>any): void;
      batch(array: BatchType[], callback?: (error?: any)=>any): void;
      batch():LevelUpChain;
      isOpen():boolean;
      isClosed():boolean;
      createReadStream(options?: any): any;
      createKeyStream(options?: any): any;
      createValueStream(options?: any): any;
      createWriteStream(options?: any): any;
      destroy(location: string, callback?: Function): void;
      repair(location: string, callback?: Function): void;
    }

    type LevelUp = LevelUpBase<Batch>

      interface LevelUpChain {
        put(key: any, value: any): LevelUpChain;
        put(key: any, value: any, options?: { sync?: boolean }): LevelUpChain;
        del(key: any): LevelUpChain;
        del(key: any, options ?: { keyEncoding?: Encoding; sync?: boolean }): LevelUpChain;
        clear(): LevelUpChain;
        write(callback?: (error?: any)=>any) : LevelUpChain;
      }

    interface levelupOptions<K=any, V=any, O=any, PO=any, GO=any, DO=any, IO=any, BO=any> {
      createIfMissing?: boolean; 
      errorIfExists?: boolean; 
      compression?: boolean; 
      cacheSize?: number; 
      keyEncoding?: Encoding; 
      valueEncoding?: Encoding; 
      db?: AbstractLevelDOWN<K, V, O, PO, GO, DO, IO, BO>
    }

    interface LevelUpConstructor {
      (location: string, options?: levelupOptions): LevelUp;
      (options: levelupOptions): LevelUp;
    }
  }
}
