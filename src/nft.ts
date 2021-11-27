import abi from "./abi.json";
import Web3 from "web3";
import BN from "bn.js";
const web3 = new Web3("https://bsc-dataseed1.binance.org:443");

const { toBN } = web3.utils;

const CONTRACT_ADDRESS = "0x30cc0553f6fa1faf6d7847891b9b36eb559dc618";

enum Rarity {
  COMMON = 0,
  RARE,
  SUPER_RARE,
  EPIC,
  LEGENDARY,
  SUPER_LEGENDARY,
}

class Hero {
  id!: string;
  index!: string;
  rarity!: Rarity;
  level!: string;
  color!: string;
  skin!: string;
  stamina!: string;
  speed!: string;
  bombSkin!: string;
  bombCount!: string;
  bombPower!: string;
  bombRange!: string;
  ability!: string;
  abilities!: string;

  constructor(params?: Partial<Hero>) {
    Object.assign(this, params);
  }
}

const decodeId = (big: BN) => big.and(big.shln(30).sub(toBN(1)));

const decodeIndex = (big: BN) =>
  big.shrn(30).and(toBN(1).shln(10).sub(toBN(1)));

const pad = (pad: number) => (big: BN) => big.shrn(pad).and(toBN(31));

const decodeRarity = (uint256: BN) => pad(40)(uint256);
const decodeLevel = (uint256: BN) => pad(45)(uint256);
const decodeColor = (uint256: BN) => pad(50)(uint256);
const decodeSkin = (uint256: BN) => pad(55)(uint256);
const decodeStamina = (uint256: BN) => pad(60)(uint256);
const decodeSpeed = (uint256: BN) => pad(65)(uint256);
const decodeBombSkin = (uint256: BN) => pad(70)(uint256);
const decodeBombCount = (uint256: BN) => pad(75)(uint256);
const decodeBombPower = (uint256: BN) => pad(80)(uint256);
const decodeBombRange = (uint256: BN) => pad(85)(uint256);
const decodeAbility = (uint256: BN) => pad(90)(uint256);
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

const decodeHero = (hash: string) => {
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

export const getAccountNFTS = (address: string) =>
  new Promise<string[]>(async (resolve) => {
    const ERC721 = new web3.eth.Contract(abi as any, CONTRACT_ADDRESS);

    const tokens = await ERC721.methods.getTokenDetailsByOwner(address).call();
    resolve(tokens);
  });

export const getAccountHeroes = (nfts: string[]) =>
  new Promise<Hero[]>((resolve) => {
    resolve(nfts.map((nft) => decodeHero(nft)));
  });
