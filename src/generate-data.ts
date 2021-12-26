import { getBlock } from "./core/block";
import { getBHeroContract } from "./core/bhero";
import { decode } from "./core/bhero/decode";
import { getBlockHash } from "./blockhash";

import fs from "fs";
import BN from "bn.js";
import { encrypt } from "./core/random";
import Web3 from "web3";

const { toBN } = Web3.utils;

type CreateTokenResult = {
  to: string;
  tokenId: string;
  details: string;
};

type CreateTokenRequestResult = {
  to: string;
  block: string;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const main = async () => {
  const contract = getBHeroContract();
  const writeStream = fs.createWriteStream(`${__dirname}/data.csv`, {
    flags: "a",
  });

  const createTokenRequests = new Map<string, number[]>();

  if (!contract) return null;

  const removeFirstBlockRequest = (to: string, blockNumber: number) => {
    const requests = createTokenRequests.get(to);
    if (!requests) return;
    const index = requests.indexOf(blockNumber);
    if (index === -1) return;
    requests.splice(index, 1);

    if (requests.length === 0) {
      createTokenRequests.delete(to);
    }
  };

  const _handleTokenCreated = async (event: any) => {
    const { returnValues } = event;
    const { to, block: requestedBlock }: CreateTokenRequestResult =
      returnValues;

    const requests = createTokenRequests.get(to);
    const block = Number(requestedBlock);

    if (!requests) {
      createTokenRequests.set(to, [block]);

      return;
    }

    createTokenRequests.set(to, [...requests, block]);
  };

  const _handleCreatedHero = async (event: any): Promise<void> => {
    const { blockNumber, returnValues } = event;
    const { to, tokenId, details }: CreateTokenResult = returnValues;
    const hero = decode(details);

    try {
      const parentBlockId = blockNumber - 1;

      const {
        timestamp,
        difficulty,
        parentHash: parentBlockHash,
      } = await getBlock(blockNumber);

      const requests = createTokenRequests.get(to);

      if (!requests) return;

      const targetBlock = requests[0];
      removeFirstBlockRequest(to, targetBlock);

      const initialSeed = toBN(await getBlockHash(targetBlock)).toString();

      const createTokenSeed = toBN(encrypt([initialSeed, tokenId])!).toString();

      const data = [
        blockNumber,
        targetBlock,
        initialSeed,
        tokenId,
        createTokenSeed,
        timestamp,
        parentBlockId,
        parentBlockHash,
        difficulty,
        details,
        hero.rarity,
      ];

      writeStream.write(data.join(",") + "\n");
    } catch (e) {
      await wait(3000);

      return _handleCreatedHero(event);
    }
  };

  contract.events
    .TokenCreateRequested()
    .on("connected", (subscriptionId: string) => {
      console.log(`Subscribed to TokenCreateRequested event ${subscriptionId}`);
    })
    .on("data", _handleTokenCreated)
    .on("error", (error: any) => console.error(error));

  contract.events
    .TokenCreated()
    .on("connected", (subscriptionId: string) => {
      console.log(`Subscribed to TokenCreated event ${subscriptionId}`);
    })
    .on("data", _handleCreatedHero)
    .on("error", (error: any) => {
      console.log({ error });
    });

  setInterval(() => {
    console.log("pending token requests");

    for (const request of createTokenRequests) {
      console.log(request);
    }
  }, 15000);
};

main().catch((e) => console.log(e));
