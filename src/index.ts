import WS from "ws";
import axios from "axios";
import { getAccountAddress, signRequest } from "./web3";
import { getAccountHeroes, getAccountNFTS, Hero } from "./nft";
import { getBlockHash } from "./blockContract";
import BN from "bn.js";

const ADDRESS = "0x0C4F1b8471BAEb0E301FEb31414A1D941F03166B";

type AuthRequestResponse = {
  code: number;
  message: string;
};

type VerifyAuthResponse = {
  code: number;
  message: boolean;
};

const createAuthRequest = async (address: string) => {
  const request = await axios.get<AuthRequestResponse>(
    `https://api.bombcrypto.io/auth/token?address=${address}`
  );

  if (request.status !== 200) throw new Error("API is down");

  return request.data.message;
};

const verifyAuthRequest = async (address: string, signature: string) => {
  const request = await axios.post<VerifyAuthResponse>(
    "https://api.bombcrypto.io/auth/verify",
    {
      address,
      signature,
    }
  );

  if (request.status !== 200) throw new Error("API is down");

  return request.data.message;
};

const main = async () => {
  try {
    // const address = await getAccountAddress();
    // console.log("address: ", address);

    const nfts = await getAccountNFTS(
      "0x9ff29073b216601f60d8b7cd8f693ece33dd2a04"
    );

    console.log(await getBlockHash(new BN(13678630)));

    console.log("nfts: ", nfts);
    let heroes = await getAccountHeroes(nfts);
    console.log("heroes: ", heroes);

    heroes.sort((a, b) => a.rarity - b.rarity);

    let rarities = new Map<number, number>();

    for (const hero of heroes) {
      const index = hero.rarity;
      const count = rarities.get(index);

      if (count) {
        rarities.set(index, count + 1);
      } else {
        rarities.set(index, 1);
      }
    }

    console.log(rarities.entries());

    // const stringToSign = await createAuthRequest(address);
    // console.log("stringToSign: ", stringToSign);

    // const { signature } = await signRequest(stringToSign);
    // const isVerified = await verifyAuthRequest(address, signature);

    // if (!isVerified) throw new Error("Could not verify your request");

    // console.log("Signature verified, connecting to web socket...");

    // const socket = new WS("wss://server.bombcrypto.io:8443/websocket", {
    //   headers: {
    //     Host: "server.bombcrypto.io:8443",
    //     // "Sec-WebSocket-Key": "cA158EowfS7ONhqiDr4uZQ",
    //     // "Sec-WebSocket-Version": 13,
    //     "User-Agent":
    //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 OPR/81.0.4196.52",
    //   },
    // });

    // socket.on("open", () => {
    //   const buffer = Buffer.from(
    //     "80003412000300016302000001610300000001701200020003617069080006312e372e31350002636c08000b556e69747920576562474c",
    //     "hex"
    //   );

    //   console.log("buffer: ", buffer.toString("binary"));

    //   console.log("opening");

    //   socket.send(buffer, (err) => {
    //     console.log("err: ", err);
    //   });
    // });

    // socket.on("message", (message) => {
    //   console.log("message: ", Buffer.from(message as any, "binary"));
    // });

    // socket.on("error", (err) => {
    //   console.log("err: ", err);
    // });
  } catch (e) {
    console.log("e: ", e);
  }
};

main();
