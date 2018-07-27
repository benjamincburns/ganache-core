declare module 'medeadown' {
  import { AbstractLevelDOWN } from 'abstract-leveldown'

  export = medeadown;

  var medeadown: medeadown.MedeaDOWNConstructor;

  namespace medeadown {
    interface MedeaDOWNConstructor<K=any, V=any, O=any, PO=any, GO=any, DO=any, IO=any, BO=any> {
      (location: string): AbstractLevelDOWN<K, V, O, PO, GO, DO, IO, BO>;
    }
  }
}

