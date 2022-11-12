

export type EntityID = string
export type Attribute = string
export type Value = string | number | boolean

export class Datum {


  constructor(private _entity: EntityID, private _attribute: Attribute, private _value: Value){}


  // Should only use entity, attribute, and value
  hash(): string {
    return this.entity + "." + this.attribute + "." + this.value
  }

  // Should only use entity, attribute, and value
  equalsTo(other: Datum): boolean {
    return this.entity === other.entity && this.attribute === other.attribute && this.value === other.value
  }

  get entity(){
    return this._entity
  }

  get attribute(){
    return this._attribute
  }

  get value(){
    return this._value
  }

  update(obj: {entity?: string, attribute?: string, value: Value}) {
    return new Datum(
        obj.entity ?? this.entity,
        obj.attribute ?? this.attribute,
        obj.value ?? this.value
        )
  }
}