export type SchemaValue = MBoolean | MString | MEntity | MDatetime | MMany;

interface ICanBeOptional<A> {
  isOptional: boolean;
  optional(): A;
}

interface ICanAuto<A> {
  isAuto: boolean;
  auto(): A;
}

class MMany {
  constructor(private _type: MBoolean | MString | MEntity | MDatetime) {}
  get type() {
    return this._type;
  }
}

class MBoolean implements ICanBeOptional<MBoolean> {
  private _isOptional: boolean = false;

  get isOptional(): boolean {
    return this.isOptional;
  }

  optional(): MBoolean {
    this._isOptional = true;
    return this;
  }
}
class MString implements ICanBeOptional<MString> {
  private _isOptional: boolean = false;

  get isOptional(): boolean {
    return this.isOptional;
  }

  optional(): MString {
    this._isOptional = true;
    return this;
  }
}
class MEntity implements ICanBeOptional<MEntity> {
  private _isOptional: boolean = false;

  constructor(private _ref: string) {}

  get ref(): string {
    return this._ref;
  }

  get isOptional(): boolean {
    return this.isOptional;
  }

  optional(): MEntity {
    this._isOptional = true;
    return this;
  }
}
class MDatetime implements ICanBeOptional<MDatetime>, ICanAuto<MDatetime> {
  private _isOptional: boolean = false;

  get isOptional(): boolean {
    return this.isOptional;
  }
  private _isAuto: boolean = false;

  optional(): MDatetime {
    this._isOptional = true;
    return this;
  }

  get isAuto(): boolean {
    return this._isAuto;
  }

  auto(): MDatetime {
    this._isAuto = true;
    return this;
  }
}

export function boolean(): MBoolean {
  return new MBoolean();
}

export function string(): MString {
  return new MString();
}

export function datetime(): MDatetime {
  return new MDatetime();
}

export function entity(ref: string): MEntity {
  return new MEntity(ref);
}

export function many(type: MBoolean | MString | MEntity | MDatetime): MMany {
  return new MMany(type);
}
