import BN from "bn.js";
import React, { useRef, useState } from "react";
import { BlockTransactionString } from "web3-eth";

/**
 * Dependencies
 */
import { toBN } from "web3-utils";
import {
  bytes32ToBN,
  getBlockHash,
  getCurrentBlockTimestamp,
  toBlockNumber,
} from "../../../core/blockhash";
import { Hero } from "../../../core/models/hero";
import { Web3Service } from "../../../core/web3";
import Alert from "../../shared/components/Alert";

/**
 * Components
 */
import Box from "../../shared/components/Box";
import Button from "../../shared/components/Button";
import HeroViewer from "../../shared/components/HeroViewer";
import Input from "../../shared/components/Input";
import { mint } from "./utils/mint";

type State = {
  amount: string; // Amount of heroes to mint
  block: string; // Current block number
  blockTimestamp: string; // Current block timestamp
  parentBlockHash: string; // Parent block hash
  targetBlock: string;
  targetBlockHash: string;
  tokenId: string;
};

const PreviewMint: React.FC = () => {
  const provider = Web3Service.getWeb3();
  const refBlock = useRef<BlockTransactionString>();

  const [state, setState] = useState<State>({
    amount: "", // Amount of heroes to mint
    block: "", // Current block number
    blockTimestamp: "", // Current block timestamp
    parentBlockHash: "", // Parent block hash
    targetBlock: "", // Block number when called mint()
    targetBlockHash: "", // blockhash(targetBlock)
    tokenId: "", // Global token ID
  });

  const [heroes, setHeroes] = useState<Hero[]>();

  const [error, setError] = useState("");

  const updateState = (key: keyof State, value: string) =>
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));

  const _handleChange =
    (key: keyof State) => (e: React.FormEvent<HTMLInputElement>) => {
      const { value } = e.currentTarget;

      updateState(key, value);
    };

  const _handleMintOnClick = async () => {
    try {
      setError("");

      const blockNumber = toBN(state.block);
      const startTokenId = toBN(state.tokenId);

      const targetBlock = toBN(state.targetBlockHash);
      const blockTimeStamp = toBN(state.blockTimestamp);

      const result = await mint({
        blockNumber,
        count: +state.amount,
        startTokenId,
        targetBlock,
        parentBlockHash: state.parentBlockHash,
        blockTimeStamp,
      });

      setHeroes(result);
    } catch (error: any) {
      console.log("error: ", error);

      setError(error.message);

      return null;
    }
  };

  React.useEffect(() => {
    const _load = async () => {
      const refBlockNumber = (await provider.eth.getBlockNumber()) - 256;
      const result = await provider.eth.getBlock(refBlockNumber);

      refBlock.current = result;
    };

    _load();
  }, []);

  React.useEffect(() => {
    const _load = async () => {
      if (!state.block || !refBlock.current) return;

      const parentBlockNumber = toBN(state.block).sub(toBN(1));

      const past = new BN(refBlock.current.number);
      const future = new BN(state.block);

      const diff = future.sub(past).mul(new BN(3));
      const result = new BN(refBlock.current.timestamp).add(diff);

      const parentBlockHash = bytes32ToBN(
        await getBlockHash(parentBlockNumber)
      );

      updateState("blockTimestamp", result.toString());
      updateState("parentBlockHash", parentBlockHash.toString());
    };

    _load();
  }, [state.block]);

  React.useEffect(() => {
    if (!state.targetBlock) return;

    const _load = async () => {
      const targetBlockHash = bytes32ToBN(
        await getBlockHash(toBN(state.targetBlock))
      );

      updateState("targetBlockHash", targetBlockHash.toString());
    };

    _load();
  }, [state.targetBlock]);

  return (
    <div className="flex flex-col gap-6 h-min w-3/4">
      <Box className="flex flex-col">
        {error && <Alert type="error" message={error} />}

        <div className="flex gap-4">
          <Input
            id={"amount"}
            className="w-64"
            value={state.amount}
            onChange={_handleChange("amount")}
            label="Heroes to be minted"
            placeholder="Amount"
          />

          <Input
            id={"targetBlock"}
            className="w-1/2"
            value={state.targetBlock}
            onChange={_handleChange("targetBlock")}
            label="Request target block"
            placeholder="Block number when called mint()"
          />

          <Input
            id={"tokenId"}
            value={state.tokenId}
            onChange={_handleChange("tokenId")}
            label="Token ID"
            placeholder="Token ID"
          />
        </div>

        <div className="flex gap-4">
          <Input
            id={"block"}
            className="w-1/2"
            value={state.block}
            onChange={_handleChange("block")}
            label="Block number"
            placeholder="Block number when called processTokenRequest()"
          />
        </div>

        <Button onClick={_handleMintOnClick}>Mint</Button>
      </Box>

      <Box>
        <h1 className="text-white text-lg">Results</h1>
        <h2 className="text-white text-sm">Your generated heroes</h2>

        <div>{heroes && <HeroViewer heroes={heroes} />}</div>
      </Box>
    </div>
  );
};

export default PreviewMint;
