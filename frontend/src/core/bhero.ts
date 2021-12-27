import { Web3Service } from "./web3";
import { decode } from "./bhero/decode";

import { AbiItem, toBN } from "web3-utils";

import abi from "./abi/bhero.json";
import Web3 from "web3";

import * as bcoin from "./coin";
import * as design from "./design";

const web3 = Web3Service.getWeb3();
const web3Socket = Web3Service.getWebSocket();

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

export const setBHeroContractForCustomProvider = (web3: Web3) =>
  new web3.eth.Contract(abi as AbiItem[], CONTRACT_ADDRESS);

export const getWebSocketBHeroContract = () =>
  new web3Socket.eth.Contract(abi as AbiItem[], CONTRACT_ADDRESS);

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

export const upgrade = (provider: Web3, baseId: number, materialId: number) =>
  new Promise(async (resolve, reject) => {
    try {
      const enhancedContract = setBHeroContractForCustomProvider(provider);
      const account = provider.eth.defaultAccount;

      const cost = await design.getUpgradeCost(0, 1);
      await bcoin.checkBCOINAllowance(account, cost);

      await new Promise((resolve, reject) => {
        enhancedContract.methods
          .upgrade(baseId, materialId)
          .send({
            from: account,
            gas: 190000,
          })
          .on("confirmation", (confirmationNumber: any, receipt: any) => {
            if (confirmationNumber >= 6) {
              resolve(true);
            }
          })
          .on("error", (ex: any) => {
            reject(ex);
          });
      });
    } catch (ex) {
      console.error(`exception ${ex}`);
      return reject(ex);
    }

    return resolve(true);
  });
