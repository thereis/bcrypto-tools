import BN from "bn.js";
import Web3 from "web3";
import { BlockTransactionString } from "web3-eth";

const { toBN, soliditySha3 } = Web3.utils;

export const objectToString = (object: any) => {
  return JSON.stringify(object, (key, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  });
};

export class Utils {
  constructor(
    private block: BlockTransactionString,
    private parentBlock: BlockTransactionString,
    private seed: BN
  ) {}

  private weights = [8287, 1036, 518, 104, 52, 4];

  /**
   * Calculates a random seed value
   */
  randomSeed = () =>
    toBN(
      soliditySha3(
        this.block.timestamp,
        this.parentBlock.hash,
        this.block.difficulty,
        this.seed
      )!
    );

  // Random [0, modulus)
  random = (modulus: BN) => {
    let nextSeed = this.randomSeed();
    const result = nextSeed.mod(modulus);

    return { nextSeed, result };
  };

  // Random [from, to)
  randomRange = (from: BN, to: BN) => {
    if (from.gt(to)) {
      throw new Error("Invalid random range");
    }

    let { nextSeed, result } = this.random(to.sub(from));

    result = result.add(from);

    return { nextSeed, result };
  };

  randomByWeights = () => {
    let totalWeight = toBN(0);

    for (let i = 0; i < this.weights.length; ++i) {
      totalWeight = totalWeight.add(toBN(this.weights[i]));
    }

    const { nextSeed: seed, result: randMod } = this.randomRange(
      toBN(0),
      totalWeight
    );

    let total = toBN(0);

    for (let index = 0; index < this.weights.length; index++) {
      total = total.add(toBN(this.weights[index]));

      if (randMod.lt(total)) {
        return {
          seed,
          index,
        };
      }
    }

    return { seed, index: 0 };
  };

  // Reservoir sampling
  randomSampling = () => {};
}
