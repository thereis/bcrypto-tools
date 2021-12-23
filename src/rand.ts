import abi from "./abi.json";

import Web3 from "web3";
import BN from "bn.js";
import { BlockTransactionString } from "web3-eth";
import { BlockNumber } from "web3-core";
import { getBlock } from "./blockhash";
import { getBlockHash } from "./blockContract";
import { Utils } from "./utils";
import { decodeHero, getTokenIdCounter } from "./nft";
import { Details, encodeNFT, rarityStats, setIndex } from "./createNft";

const { encodePacked, keccak256, toBN, soliditySha3 } = Web3.utils;

const CONTRACT_ADDRESS = "0x30cc0553f6fa1faf6d7847891b9b36eb559dc618";

const web3 = new Web3("https://bsc-dataseed1.binance.org:443");

class CreateTokenRequest {
  targetBlock!: BN; // Use future block.
  count!: number; // Amount of tokens to mint.
  rarity!: number; // 0: random rarity, 1 - 6: specified rarity.

  constructor(params?: Partial<CreateTokenRequest>) {
    Object.assign(this, params);
  }
}

const COLOR_COUNT = toBN(5);
const SKIN_COUNT = toBN(8);
const BOMB_SKIN_COUNT = toBN(20);
const abilityIds = [1, 2, 3, 4, 5, 6, 7].map((id) => toBN(id));

enum BHeroDetails {
  ALL_RARITY,
}

const maskLast8Bits = toBN(0xff);
const maskFirst248Bits = toBN(0xff).notn(256);

let tokenIdCounter = 0;

/**
 * TargetBlock = currentBlock + 5
 * seed = uint256(blockhash(currentBlock + 5));
 * id = tokenIdCounter.current();
 * tokenSeed = uint256(keccak256(abi.encode(seed, id)));
 *
 * dropRate = [8287, 1036, 518, 104, 52, 4];
 * (seed, details.rarity) = Utils.randomByWeights(seed, dropRate);
 *====================================================================
 * (, details) = design.createRandomToken(tokenSeed, id, rarity); // RESULT
 */

const createToken = async (
  currentBlockNumber: number,
  count: number,
  rarity: number,
  seed: BN
) => {
  for (let i = 0; i < count; i++) {
    const id = tokenIdCounter;
    console.log("id: ", id);

    const tokenSeed = toBN(soliditySha3(seed, id)!);
    console.log("tokenSeed: ", tokenSeed.toString());

    const block = await getBlock(13712850);

    if (!block) {
      throw new Error("Block not found");
    }

    // const block = await getBlock(currentBlockNumber);
    const parentBlock = await getBlock(currentBlockNumber - 1);
    const utils = new Utils(block, parentBlock);
    const result = utils.randomByWeights(tokenSeed);

    if (BHeroDetails.ALL_RARITY === rarity) {
      console.log("result: ", result.index);
    } else {
      console.log("Rarity is common!");
    }

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
      id: toBN(id),
      index: toBN(0),
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

    const encodedDetails = encodeNFT(details);
    const decodedDetails = decodeHero(encodedDetails.toString());

    console.log("decodedDetails: ", decodedDetails);

    tokenIdCounter = id + 1;
  }

  console.log("end tokenIdCounter: ", tokenIdCounter);
};

const mint = async () => {
  tokenIdCounter = +(await getTokenIdCounter());
  // tokenIdCounter = 7094850;

  console.log("start tokenIdCounter: ", tokenIdCounter);

  const blockNumber = toBN(13712800);
  console.log("blockNumber: ", blockNumber.toString());

  const requests = [
    new CreateTokenRequest({
      count: 1,
      rarity: 0,
      targetBlock: blockNumber.add(toBN(5)),
    }),
  ];

  for (let i = requests.length; i > 0; --i) {
    const {
      targetBlock: requestTargetBlock,
      count,
      rarity: requestRarity,
    } = requests[i - 1];

    console.log("requestTargetBlock: ", requestTargetBlock.toString());

    if (blockNumber.gt(requestTargetBlock)) {
      throw new Error("Target block not arrived");
    }

    const currentBlockNumber = requestTargetBlock.toNumber();
    let targetBlock = requestTargetBlock;
    let rarity = requestRarity;

    let seed = toBN(await getBlockHash(targetBlock));
    console.log("seed: ", seed.toString("hex"));

    if (seed.eq(toBN(0))) {
      if (rarity === 0) {
        // Expired, forced common.
        rarity = 1;
      }

      targetBlock = blockNumber
        .and(maskFirst248Bits)
        .add(targetBlock.and(maskLast8Bits));

      if (targetBlock.gte(blockNumber)) {
        targetBlock = targetBlock.sub(toBN(256));
      }

      seed = toBN(await getBlockHash(targetBlock));
    }

    await createToken(currentBlockNumber, count, rarity, seed);
  }
};

mint().catch((e) => {
  console.log(e);
});
