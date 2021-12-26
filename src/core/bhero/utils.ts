import BN from "bn.js";
import { Stats, StatsRange } from "../models/stats";

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
