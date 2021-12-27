import BN from "bn.js";
import React, { useState } from "react";

/**
 * Dependencies
 */
import { toBN } from "web3-utils";
import {
  bytes32ToBN,
  calculateBlockHash,
  getBlock,
  getBlockHash,
} from "../../../src/core/blockhash";
import { Hero } from "../../../src/core/models/hero";
import Alert from "../../../src/shared/components/Alert";

/**
 * Components
 */
import Box from "../../../src/shared/components/Box";
import Button from "../../../src/shared/components/Button";
import Checkbox from "../../../src/shared/components/Checkbox";
import HeroViewer from "../../../src/shared/components/HeroViewer";
import Input from "../../../src/shared/components/Input";
import { mint } from "../../../src/core/mint/mint";

type State = {
  amount: string; // Amount of heroes to mint
  block: string; // Current block number
  blockTimestamp: string; // Current block timestamp
  parentBlockHash: string; // Parent block hash
  targetBlock: string;
  tokenId: string;
  isPastMint: boolean;
};

const PreviewMint: React.FC = () => {
  const [state, setState] = useState<State>({
    amount: "", // Amount of heroes to mint
    block: "", // Current block number
    blockTimestamp: "", // Current block timestamp
    parentBlockHash: "", // Parent block hash
    targetBlock: "", // Block number when called mint()
    tokenId: "", // Global token ID
    isPastMint: false,
  });

  const [heroes, setHeroes] = useState<Hero[]>();

  const [error, setError] = useState("");

  const updateState = (key: keyof State, value: string | boolean) =>
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));

  const _handleChange =
    (key: keyof State) => (e: React.FormEvent<HTMLInputElement>) => {
      const { value } = e.currentTarget;

      updateState(key, value);
    };

  const _handleOnPastCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;

    updateState("isPastMint", checked);
  };

  const _handleMintOnClick = async () => {
    try {
      setError("");

      const blockNumber = toBN(state.block);
      const startTokenId = toBN(state.tokenId);

      const targetBlock = toBN(state.targetBlock);
      const blockTimeStamp = toBN(state.blockTimestamp);

      const result = await mint({
        blockNumber,
        count: +state.amount,
        startTokenId,
        targetBlock,
        parentBlockHash: state.parentBlockHash,
        blockTimeStamp,
        isPast: state.isPastMint,
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
      if (!state.block) return;

      const refBlock = await getBlock(
        new BN(state.block).sub(new BN(32)).toNumber()
      );

      const parentBlockNumber = toBN(state.block).sub(toBN(1));

      const past = new BN(refBlock.number);
      const future = new BN(state.block);

      const diff = future.sub(past).mul(new BN(3));
      const result = new BN(refBlock.timestamp).add(diff);

      let parentBlockHash: BN;

      if (state.isPastMint) {
        parentBlockHash = bytes32ToBN(
          await calculateBlockHash(parentBlockNumber)
        );
      } else {
        parentBlockHash = bytes32ToBN(await getBlockHash(parentBlockNumber));
      }

      updateState("blockTimestamp", result.toString());
      updateState("parentBlockHash", parentBlockHash.toString());
    };

    _load();
  }, [state.block]);

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
            primary="Heroes to be minted"
            placeholder="Amount"
          />

          <Input
            id={"targetBlock"}
            className="w-1/2"
            value={state.targetBlock}
            onChange={_handleChange("targetBlock")}
            primary="Request target block"
            placeholder="Block number when called mint()"
          />

          <Input
            id={"tokenId"}
            value={state.tokenId}
            onChange={_handleChange("tokenId")}
            primary="Token ID"
            placeholder="Token ID"
          />
        </div>

        <div className="flex gap-4">
          <Input
            id={"block"}
            className="w-1/2"
            value={state.block}
            onChange={_handleChange("block")}
            primary="Block number"
            placeholder="Block number when called processTokenRequest()"
          />
        </div>

        <div className="flex flex-col">
          <Checkbox
            checked={state.isPastMint}
            onChange={_handleOnPastCheck}
            label="Does this happened in the past?"
          />
          <Button onClick={_handleMintOnClick}>Mint</Button>
        </div>
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
