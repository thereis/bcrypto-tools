import { Web3Service } from "./web3";
import { decode } from "./bhero/decode";

import { AbiItem, toBN } from "web3-utils";

import abi from "./abi/bhero.json";

const web3 = Web3Service.getWeb3();

const CONTRACT_ADDRESS = "0x30cc0553f6fa1faf6d7847891b9b36eb559dc618";

export const COLOR_COUNT = toBN(5);
export const SKIN_COUNT = toBN(8);
export const BOMB_SKIN_COUNT = toBN(20);
export const abilityIds = [1, 2, 3, 4, 5, 6, 7].map((id) => toBN(id));

export enum BHeroDetails {
  ALL_RARITY,
}

export const getBHeroContract = () =>
  new web3.eth.Contract(abi as AbiItem[], CONTRACT_ADDRESS);

export const getAccountNFTS = (address: string) =>
  new Promise<string[]>(async (resolve, reject) => {
    try {
      const ERC721 = getBHeroContract();

      const tokens = await ERC721.methods
        .getTokenDetailsByOwner(address)
        .call();

      resolve(tokens);
    } catch (e) {
      reject(e);
    }
  });

export const decodeToHero = (seed: string) => decode(seed);

export const decodeToHeroes = (nfts: string[]) => nfts.map(decodeToHero);

export const getLastTokenId = (): Promise<number> =>
  new Promise(async (resolve, reject) => {
    try {
      const ERC721 = getBHeroContract();

      resolve(await ERC721.methods.tokenIdCounter().call());
    } catch (e) {
      reject(e);
    }
  });

export const getAccountByNftId = (id: string): Promise<string> =>
  new Promise(async (resolve, reject) => {
    try {
      const ERC721 = getBHeroContract();

      resolve(await ERC721.methods.ownerOf(id).call());
    } catch (e) {
      reject(e);
    }
  });
