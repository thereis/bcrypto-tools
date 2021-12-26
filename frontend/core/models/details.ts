import BN from "bn.js";

export class Details {
  id!: BN;
  index!: BN;
  rarity!: BN;
  level!: BN;
  color!: BN;
  skin!: BN;
  stamina!: BN;
  speed!: BN;
  bombSkin!: BN;
  bombCount!: BN;
  bombPower!: BN;
  bombRange!: BN;
  abilities!: BN[];

  constructor(params?: Partial<Details>) {
    Object.assign(this, params);
  }
}
