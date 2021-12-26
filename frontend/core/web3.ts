import Web3 from "web3";

class Web3Class {
  constructor(
    private web3 = new Web3(
      new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org:443")
    ),
    private websocket = new Web3(
      new Web3.providers.WebsocketProvider("wss://bsc-ws-node.nariox.org:443")
    )
  ) {}

  getWeb3 = () => this.web3;

  getWebSocket = () => this.websocket;
}

export const Web3Service = new Web3Class();
