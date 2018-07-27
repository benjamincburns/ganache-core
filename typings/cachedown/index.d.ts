declare module 'cachedown' {
  import { AbstractLevelDOWN } from 'abstract-leveldown'

  export class CacheDOWN<K=any, V=any, O=any, PO=any, GO=any, DO=any, IO=any, BO=any> extends AbstractLevelDOWN<K, V, O, PO, GO, DO, IO, BO> {
    constructor(location: string, leveldown: AbstractLevelDOWN<K, V, O, PO, GO, DO, IO, BO> | ((location: string) => AbstractLevelDOWN<K, V, O, PO, GO, DO, IO, BO>))
    clearCache(): void
    maxSize(size: number): CacheDOWN<K, V, O, PO, GO, DO, IO, BO>
    static setLeveldown<K_, V_, O_, PO_, GO_, DO_, IO_, BO_>(leveldown: AbstractLevelDOWN<K_, V_, O_, PO_, GO_, DO_, IO_, BO_>): void
    static factory<K_, V_, O_, PO_, GO_, DO_, IO_, BO_>(): (...args: any[]) => CacheDOWN<K_, V_, O_, PO_, GO_, DO_, IO_, BO_>
  }

  export default CacheDOWN
}
