import BN from "bn.js";
import {
  MASK_FIRST_248_BITS,
  MASK_LAST_8_BITS,
} from "../../../../core/bhero/utils";
import {
  bytes32ToBN,
  calculateBlockHash,
  getBlockHash,
} from "../../../../core/blockhash";
import { CreateTokenRequest } from "../../../../core/models/token-request";

type Params = {
  request: CreateTokenRequest;
  blockNumber: BN;
  isPast?: boolean;
};

export const processTokenRequests = async ({
  blockNumber,
  request,
  isPast = false,
}: Params) => {
  const { targetBlock: requestTargetBlock, rarity: requestRarity } = request;

  let rarity = requestRarity;
  let targetBlock = requestTargetBlock;

  let seed = bytes32ToBN(await getBlockHash(targetBlock));
  console.log(`processTokenRequests seed: ${seed.toString()}`);

  if (isPast && seed.eq(new BN(0))) {
    seed = bytes32ToBN(await calculateBlockHash(targetBlock));
  }

  // if seed=0, then we need to generate a new seed.
  if (seed.eq(new BN(0)) && !isPast) {
    if (rarity === 0) {
      // Expired, forced common.
      rarity = 1;
    }

    targetBlock = blockNumber
      .and(MASK_FIRST_248_BITS)
      .add(targetBlock.and(MASK_LAST_8_BITS));

    if (targetBlock.gte(blockNumber)) {
      targetBlock = targetBlock.sub(new BN(256));
    }

    seed = bytes32ToBN(await getBlockHash(targetBlock));
  }

  return {
    seed,
    rarity,
    targetBlock,
  };
};
