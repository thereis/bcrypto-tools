import BN from "bn.js";

export class StatsRange {
  constructor(public min: BN, public max: BN) {}
}

export class Stats {
  stamina!: StatsRange;
  speed!: StatsRange;
  bombCount!: BN;
  bombPower!: StatsRange;
  bombRange!: BN;
  ability!: BN;

  constructor(params?: Partial<Stats>) {
    Object.assign(this, params);
  }
}
