import Web3 from "web3";
import BN from "bn.js";

import { Hero } from "../models/hero";

const { toBN } = Web3.utils;

const pad = (uint256: BN) => (pad: number) => uint256.shrn(pad).and(toBN(31));

const decodeId = (uint256: BN) => uint256.and(toBN(1).shln(30).sub(toBN(1)));
const decodeIndex = (uint256: BN) =>
  uint256.shrn(30).and(toBN(1).shln(10).sub(toBN(1)));

const decodeRarity = (uint256: BN) => pad(uint256)(40);
const decodeLevel = (uint256: BN) => pad(uint256)(45);
const decodeColor = (uint256: BN) => pad(uint256)(50);
const decodeSkin = (uint256: BN) => pad(uint256)(55);
const decodeStamina = (uint256: BN) => pad(uint256)(60);
const decodeSpeed = (uint256: BN) => pad(uint256)(65);
const decodeBombSkin = (uint256: BN) => pad(uint256)(70);
const decodeBombCount = (uint256: BN) => pad(uint256)(75);
const decodeBombPower = (uint256: BN) => pad(uint256)(80);
const decodeBombRange = (uint256: BN) => pad(uint256)(85);
const decodeAbility = (uint256: BN) => pad(uint256)(90);

const decodeAbilities = (uint256: BN, ability: BN): BN[] => {
  let abilities: BN[] = [ability];

  let i = toBN(0).toNumber();

  for (i; i < ability.toNumber(); ++i) {
    abilities[i] = uint256
      .shrn(
        toBN(95)
          .add(toBN(i).mul(toBN(5)))
          .toNumber()
      )
      .and(toBN(31));
  }

  return abilities;
};

export const decode = (hash: string) => {
  const details = Web3.utils.toBN(hash);

  let id = decodeId(details).toString();
  let index = decodeIndex(details).toString();
  let rarity = +decodeRarity(details).toString();
  let level = decodeLevel(details).toString();
  let color = decodeColor(details).toString();
  let skin = decodeSkin(details).toString();
  let stamina = decodeStamina(details).toString();
  let speed = decodeSpeed(details).toString();
  let bombSkin = decodeBombSkin(details).toString();
  let bombCount = decodeBombCount(details).toString();
  let bombPower = decodeBombPower(details).toString();
  let bombRange = decodeBombRange(details).toString();
  let ability = decodeAbility(details);

  const abilities = decodeAbilities(details, ability).toString();

  const hero = new Hero({
    id,
    index,
    rarity,
    level,
    color,
    skin,
    stamina,
    speed,
    bombSkin,
    bombCount,
    bombPower,
    bombRange,
    ability: ability.toString(),
    abilities,
  });

  return hero;
};
