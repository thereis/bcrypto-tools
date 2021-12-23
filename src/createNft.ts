import BN from "bn.js";

class StatsRange {
  min: BN;
  max: BN;

  constructor(min: BN, max: BN) {
    this.min = min;
    this.max = max;
  }
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

export const setIndex = (details: BN, index: BN) => {
  details = details.and(new BN(1023).shln(30)).notn(256);
  details = details.or(new BN(index).shln(30));
  return details;
};

const pad = (big: BN) => (pad: number) => big.shln(pad);

export const encodeNFT = (details: Details): BN => {
  let value = new BN(0);

  value = value.or(details.id);
  value = value.or(pad(details.index)(30));
  value = value.or(pad(details.rarity)(40));
  value = value.or(pad(details.level)(45));
  value = value.or(pad(details.color)(50));
  value = value.or(pad(details.skin)(55));
  value = value.or(pad(details.stamina)(60));
  value = value.or(pad(details.speed)(65));
  value = value.or(pad(details.bombSkin)(70));
  value = value.or(pad(details.bombCount)(75));
  value = value.or(pad(details.bombPower)(80));
  value = value.or(pad(details.bombRange)(85));
  value = value.or(pad(new BN(details.abilities.length))(90));

  for (let i = 0; i < details.abilities.length; ++i) {
    value = value.or(pad(details.abilities[i])(95 + i * 5));
  }

  return value;
};

export const rarityStats = [
  new Stats({
    stamina: new StatsRange(new BN(1), new BN(3)),
    speed: new StatsRange(new BN(1), new BN(3)),
    bombCount: new BN(1),
    bombPower: new StatsRange(new BN(1), new BN(3)),
    bombRange: new BN(1),
    ability: new BN(1),
  }),
  new Stats({
    stamina: new StatsRange(new BN(3), new BN(6)),
    speed: new StatsRange(new BN(3), new BN(6)),
    bombCount: new BN(2),
    bombPower: new StatsRange(new BN(3), new BN(6)),
    bombRange: new BN(2),
    ability: new BN(2),
  }),
  new Stats({
    stamina: new StatsRange(new BN(6), new BN(9)),
    speed: new StatsRange(new BN(6), new BN(9)),
    bombCount: new BN(3),
    bombPower: new StatsRange(new BN(6), new BN(9)),
    bombRange: new BN(3),
    ability: new BN(3),
  }),
  new Stats({
    stamina: new StatsRange(new BN(9), new BN(12)),
    speed: new StatsRange(new BN(9), new BN(12)),
    bombCount: new BN(4),
    bombPower: new StatsRange(new BN(9), new BN(12)),
    bombRange: new BN(4),
    ability: new BN(4),
  }),
  new Stats({
    stamina: new StatsRange(new BN(12), new BN(15)),
    speed: new StatsRange(new BN(12), new BN(15)),
    bombCount: new BN(5),
    bombPower: new StatsRange(new BN(12), new BN(15)),
    bombRange: new BN(5),
    ability: new BN(5),
  }),
  new Stats({
    stamina: new StatsRange(new BN(15), new BN(18)),
    speed: new StatsRange(new BN(15), new BN(18)),
    bombCount: new BN(6),
    bombPower: new StatsRange(new BN(15), new BN(18)),
    bombRange: new BN(6),
    ability: new BN(6),
  }),
];
