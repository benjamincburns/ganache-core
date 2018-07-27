declare module 'cachedown' {
  import { AbstractLevelDOWN } from 'abstract-leveldown'

  export = cachedown;

  var cachedown: cachedown.CacheDOWNConstructor;

  namespace cachedown {

    interface CacheDOWN<K, V, O, PO, GO, DO, IO, BO> extends AbstractLevelDOWN<K, V, O, PO, GO, DO, IO, BO> {
      clearCache(): void
      maxSize(size: number): CacheDOWN<K, V, O, PO, GO, DO, IO, BO>
    }

    interface CacheDOWNConstructor<K=any, V=any, O=any, PO=any, GO=any, DO=any, IO=any, BO=any> {

      (location: string, leveldown: AbstractLevelDOWN<K, V, O, PO, GO, DO, IO, BO> | ((location: string) => AbstractLevelDOWN<K, V, O, PO, GO, DO, IO, BO>)): CacheDOWN<K, V, O, PO, GO, DO, IO, BO>
    }
  }
}
