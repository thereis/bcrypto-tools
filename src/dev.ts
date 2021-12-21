import BN from "bn.js";
import Web3 from "web3";
import core from "web3-core";

const { toBN, hexToBytes } = Web3.utils;

// console.log(Web3.utils.hexToString());

let encode = (text: string) => Buffer.from(text, "utf-8");

let encodeToHex = (text: string) =>
  Buffer.from(text, "utf-8")
    .toString("hex")
    .split(/([\da-fA-F]{2})/g)
    .filter((a) => a.length > 0)
    .join("");

// console.log("teste: ", teste);

let decode = Buffer.from("80003412000300016302000001610300", "hex").toString(
  "utf-8"
);
console.log("decode: ", decode);

let arBuffer = new ArrayBuffer(100);
// console.log("arBuffer: ", arBuffer);

// let uint = new Uint8Array(arBuffer);
// console.log("uint: ", uint);

let a = new Uint8Array(encode("api"));
console.log("a: ", a);

let b = new Uint8Array(encode("1.7.15"));
console.log("b: ", b);

let c = new Uint8Array(encode("Unity WebGL"));
console.log("c: ", c);

const buff = Buffer.from(JSON.stringify({ api: "1.7.15", cl: "Unity WebGL" }));
console.log("buff: ", buff);

console.log(
  toBN("80003412000300016302000001610300000001701200020003").toBuffer()
);

//(a & 2047) + 79861
let teste = toBN(877).and(toBN(2047));
console.log("teste: ", teste.toNumber());
