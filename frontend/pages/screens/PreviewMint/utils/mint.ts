import BN from "bn.js";
import { BHeroDetails } from "../../../../core/bhero";
import { createToken } from "./create-token";
import { processTokenRequests } from "./process-token-request";
import { requestCreateToken } from "./request-create-token";

type Params = {
  blockNumber: BN;
  blockTimeStamp: BN;
  parentBlockHash: string;

  startTokenId: BN;
  targetBlock: BN;

  count: number;

  isPast?: boolean;
};

export const mint = async ({
  blockNumber,
  blockTimeStamp,
  parentBlockHash,
  targetBlock,
  startTokenId,
  count,
  isPast = false,
}: Params) => {
  const request = requestCreateToken({
    targetBlock: targetBlock.toString(),
    count,
    rarity: BHeroDetails.ALL_RARITY,
    isPast,
  });

  const { seed, rarity } = await processTokenRequests({
    blockNumber,
    request,
    isPast,
  });

  const { results } = createToken({
    seed,
    rarity,
    count,
    timestamp: blockTimeStamp.toString(),
    parentBlockHash,
    startTokenId,
  });

  return results;
};
