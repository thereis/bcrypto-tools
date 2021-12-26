import BN from "bn.js";
import { BHeroDetails } from "../../../../core/bhero";
import { CreateTokenRequest } from "../../../../core/models/token-request";

type Params = {
  targetBlock: string;
  count: number;
  rarity: BHeroDetails;
};

export const requestCreateToken = ({
  targetBlock,
  count,
  rarity = BHeroDetails.ALL_RARITY,
}: Params) => {
  return new CreateTokenRequest({
    targetBlock: new BN(targetBlock).add(new BN(5)),
    count,
    rarity,
  });
};
