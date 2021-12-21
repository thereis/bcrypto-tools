import abi from "./abi.json";

import Web3 from "web3";
import BN from "bn.js";
import { BlockTransactionString } from "web3-eth";
import { BlockNumber } from "web3-core";
import { getBlock, getBlockHash } from "./blockhash";
import { Utils } from "./utils";
import { getTokenIdCounter } from "./nft";

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
    console.log("id", await getTokenIdCounter());

    if (BHeroDetails.ALL_RARITY === rarity) {
      const id = tokenIdCounter;
      const tokenSeed = toBN(soliditySha3(seed, id)!);
      console.log("tokenSeed: ", tokenSeed.toString());

      const block = await getBlock(currentBlockNumber);
      const parentBlock = await getBlock(currentBlockNumber - 1);

      const result = new Utils(block, parentBlock, tokenSeed).randomByWeights();
      console.log("result: ", result.index);

      tokenIdCounter = tokenIdCounter + 1;
    } else {
      console.log("Rarity is common!");
    }
  }
};

const mint = async () => {
  tokenIdCounter = await getTokenIdCounter();

  const blockNumber = toBN(13679000);
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

    let seed = toBN(await getBlockHash(targetBlock.toNumber()));
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

      seed = toBN(await getBlockHash(targetBlock.toNumber()));
    }

    await createToken(currentBlockNumber, count, rarity, seed);
  }
};

mint().catch((e) => {
  console.log(e);
});
