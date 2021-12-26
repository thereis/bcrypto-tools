import BN from "bn.js";
import Web3 from "web3";

import { BlockTransactionString } from "web3-eth";

const { toBN } = Web3.utils;

export const encrypt = (params: any[]) => Web3.utils.encodePacked(...params);

export const objectToString = (object: any) => {
  return JSON.stringify(object, (key, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  });
};

export class Random {
  constructor(
    private block: BlockTransactionString,
    private parentBlock: BlockTransactionString
  ) {}

  private weights = [8287, 1036, 518, 104, 52, 4];

  /**
   * Calculates a random seed value
   */
  randomSeed = (seed: BN) =>
    toBN(
      encrypt([
        this.block.timestamp,
        this.parentBlock.hash,
        this.block.difficulty,
        seed,
      ])!
    );

  // Random [0, modulus)
  random = (seed: BN, modulus: BN) => {
    let nextSeed = this.randomSeed(seed);
    const result = nextSeed.mod(modulus);

    return { nextSeed, result };
  };

  // Random [from, to)
  randomRange = (seed: BN, from: BN, to: BN) => {
    if (from.gt(to)) {
      throw new Error("Invalid random range");
    }

    let { nextSeed, result } = this.random(seed, to.sub(from));

    result = result.add(from);

    return { nextSeed, result };
  };

  randomRangeInclusive = (seed: BN, from: BN, to: BN) => {
    return this.randomRange(seed, from, to.add(toBN(1)));
  };

  randomByWeights = (seed: BN) => {
    let totalWeight = toBN(0);

    for (let i = 0; i < this.weights.length; ++i) {
      totalWeight = totalWeight.add(toBN(this.weights[i]));
    }

    const { nextSeed, result: randMod } = this.randomRange(
      seed,
      toBN(0),
      totalWeight
    );

    let total = toBN(0);

    for (let index = 0; index < this.weights.length; index++) {
      total = total.add(toBN(this.weights[index]));

      if (randMod.lt(total)) {
        return {
          seed: nextSeed,
          index,
        };
      }
    }

    return { seed, index: 0 };
  };

  // Reservoir sampling
  randomSampling = (seed: BN, arr: BN[], size: BN) => {
    const results = [];

    for (let i = 0; i < size.toNumber(); ++i) {
      results.push(arr[i]);
    }

    let j: BN;

    for (let i = size.toNumber(); i < arr.length; ++i) {
      const { nextSeed, result } = this.randomRange(seed, toBN(0), toBN(i));

      j = result;
      seed = nextSeed;

      if (j.lt(size)) {
        results[j.toNumber()] = arr[i];
      }
    }

    return { seed, result: results };
  };
}
