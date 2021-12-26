import Web3 from "web3";

class Web3Class {
  constructor(
    private web3 = new Web3(
      new Web3.providers.WebsocketProvider("wss://bsc-ws-node.nariox.org:443")
    )
  ) {}

  getWeb3 = () => this.web3;
}

export const Web3Service = new Web3Class();
