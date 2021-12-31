import BN from "bn.js";

import { toBN } from "web3-utils";
import {
  abilityIds,
  BHeroDetails,
  BOMB_SKIN_COUNT,
  COLOR_COUNT,
  SKIN_COUNT,
} from "../bhero";
import { decode } from "../bhero/decode";
import { encode } from "../bhero/encode";
import { rarityStats } from "../bhero/utils";
import { Details } from "../models/details";
import { Hero } from "../models/hero";
import { encrypt, Random } from "../random";

type Params = {
  seed: BN;

  timestamp: string;
  parentBlockHash: string;

  count: number;
  rarity: number;

  startTokenId: BN;
};

export const createToken = ({
  seed,
  timestamp,
  parentBlockHash,
  count,
  rarity,
  startTokenId,
}: Params) => {
  const results: Hero[] = [];

  let tokenId = startTokenId;

  for (let i = 0; i < count; i++) {
    const tokenSeed = toBN(encrypt([seed.toString(), tokenId.toString()]));

    const utils = new Random(timestamp, parentBlockHash);
    const result = utils.randomByWeights(tokenSeed);

    const stats = rarityStats[result.index];

    const color = utils.randomRangeInclusive(result.seed, toBN(1), COLOR_COUNT);
    const skin = utils.randomRangeInclusive(
      color.nextSeed,
      toBN(1),
      SKIN_COUNT
    );
    const stamina = utils.randomRangeInclusive(
      skin.nextSeed,
      stats.stamina.min,
      stats.stamina.max
    );

    const speed = utils.randomRangeInclusive(
      stamina.nextSeed,
      stats.speed.min,
      stats.speed.max
    );

    const bombSkin = utils.randomRangeInclusive(
      speed.nextSeed,
      toBN(1),
      BOMB_SKIN_COUNT
    );

    const bombPower = utils.randomRangeInclusive(
      bombSkin.nextSeed,
      stats.bombPower.min,
      stats.bombPower.max
    );

    const abilities = utils.randomSampling(
      bombPower.nextSeed,
      abilityIds,
      stats.ability
    );

    let details = new Details({
      id: tokenId,
      index: toBN(i),
      rarity: toBN(result.index),
      level: toBN(1),
      bombCount: stats.bombCount,
      bombRange: stats.bombRange,
      color: color.result,
      skin: skin.result,
      stamina: stamina.result,
      speed: speed.result,
      bombSkin: bombSkin.result,
      bombPower: bombPower.result,
      abilities: abilities.result,
    });

    const encodedDetails = encode(details);
    const decodedDetails = decode(encodedDetails.toString());

    results.push(decodedDetails);

    tokenId = tokenId.add(toBN(1));
  }

  return {
    results,
  };
};
