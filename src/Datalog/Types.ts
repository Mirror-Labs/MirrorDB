

// guide: https://tonsky.me/blog/datascript-internals/
// tips & tricks: https://tonsky.me/blog/datascript-2/
export class Datum {


  constructor(private entity: any, private attribute: any, private value: any, tx: number, added: boolean){}


  // Should only use entity, attribute, and value
  hash(): string {
    throw Error("Not implemented")
  }

  // Should only use entity, attribute, and value
  equalsTo(other: Datum): boolean {
    throw Error("Not implemented")
  }
}




class DB {

  //book keeping
  private schema: Map<string, any> = new Map()
  private rschema: Map<string, any> = new Map()
  private maxEID: number = 0
  private maxTX: number = 0

  // indexes
  private eavt: BTSet = new BTSet
  private aevt: BTSet = new BTSet
  private avet: BTSet = new BTSet

  //add
  //retract
  //search (search for a range of datums)
}

// Adding data
// entity map → op vector[s] → id resolution → datom[s]


// dbBefore + txData = dbAfter
type TxReport = {
  dbBefore: DB,
  dbAfter: DB,
  txData: Datum[],
  tempIDs: Map<number, any> //id -> entity
  txMeta: any //no idea what this contains
}


// It’s an immutable, persistent implementation of B+ tree data structure.
// continuous js arrays as tree nodes
class BTSet {

}

//Entity

/// Entity is just a convenient interface to EAVT
// make it look like a normal map
