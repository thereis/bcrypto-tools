import BN from "bn.js";
import { Details } from "../models/details";

const pad = (uint256: BN) => (pad: number) => uint256.shln(pad);

export const setIndex = (details: BN, index: BN) => {
  details = details.and(new BN(1023).shln(30)).notn(256);
  details = details.or(new BN(index).shln(30));
  return details;
};

export const encode = (details: Details): BN => {
  let value = new BN(0);

  value = value.or(details.id);
  value = value.or(pad(details.index)(30));
  value = value.or(pad(details.rarity)(40));
  value = value.or(pad(details.level)(45));
  value = value.or(pad(details.color)(50));
  value = value.or(pad(details.skin)(55));
  value = value.or(pad(details.stamina)(60));
  value = value.or(pad(details.speed)(65));
  value = value.or(pad(details.bombSkin)(70));
  value = value.or(pad(details.bombCount)(75));
  value = value.or(pad(details.bombPower)(80));
  value = value.or(pad(details.bombRange)(85));
  value = value.or(pad(new BN(details.abilities.length))(90));

  for (let i = 0; i < details.abilities.length; ++i) {
    value = value.or(pad(details.abilities[i])(95 + i * 5));
  }

  return value;
};
