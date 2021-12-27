import BN from "bn.js";
import { BHeroDetails } from "../bhero";
import { CreateTokenRequest } from "../models/token-request";

type Params = {
  targetBlock: string;
  count: number;
  rarity: BHeroDetails;
  isPast?: boolean;
};

export const requestCreateToken = ({
  targetBlock,
  count,
  rarity = BHeroDetails.ALL_RARITY,
  isPast = false,
}: Params) => {
  return new CreateTokenRequest({
    targetBlock: new BN(targetBlock).add(!isPast ? new BN(5) : new BN(0)),
    count,
    rarity,
  });
};
