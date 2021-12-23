import BN from "bn.js";
import { Details, encodeNFT } from "./createNft";
import { decodeHero } from "./nft";

const compareTwoObjects = (obj1: any, obj2: any) => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  if (obj1Keys.length !== obj2Keys.length) {
    return false;
  }

  for (let i = 0; i < obj1Keys.length; i++) {
    const key = obj1Keys[i];
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};

const superRare = new Details({
  id: new BN("3115577"),
  index: new BN("9"),
  rarity: new BN("3"),
  level: new BN("2"),
  color: new BN("4"),
  skin: new BN("6"),
  stamina: new BN("12"),
  speed: new BN("10"),
  bombSkin: new BN("10"),
  bombCount: new BN("4"),
  bombPower: new BN("12"),
  bombRange: new BN("4"),
  abilities: [new BN("1"), new BN("5"), new BN("3"), new BN("4")],
});

const encodedNFT = encodeNFT(superRare);
const decodedNFT = decodeHero(encodedNFT.toString());

const heroHash = "5320374304412212452168235100375609";
const decodedFromHash = decodeHero(heroHash);

console.log("is equal:", compareTwoObjects(decodedNFT, decodedFromHash));
