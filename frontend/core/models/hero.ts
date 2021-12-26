export enum Rarity {
  Common = 0,
  Rare,
  Super_Rare,
  Epic,
  Legend,
  Super_Legend,
}

export class Hero {
  id!: string;
  index!: string;
  rarity!: Rarity;
  level!: string;
  color!: string;
  skin!: string;
  stamina!: string;
  speed!: string;
  bombSkin!: string;
  bombCount!: string;
  bombPower!: string;
  bombRange!: string;
  ability!: string;
  abilities!: string;

  constructor(params?: Partial<Hero>) {
    Object.assign(this, params);
  }
}
