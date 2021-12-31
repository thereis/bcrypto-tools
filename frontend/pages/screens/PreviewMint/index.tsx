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
  getLastBlockNumber,
} from "../../../src/core/blockhash";
import { Hero } from "../../../src/core/models/hero";
import { mint } from "../../../src/core/mint/mint";
import {
  getLastTokenId,
  mintHero,
  processTokenRequests,
} from "../../../src/core/bhero";

/**
 * Components
 */
import Box from "../../../src/shared/components/Box";
import Button from "../../../src/shared/components/Button";
import Checkbox from "../../../src/shared/components/Checkbox";
import HeroViewer from "../../../src/shared/components/HeroViewer";
import Input from "../../../src/shared/components/Input";
import Alert from "../../../src/shared/components/Alert";
import useMetaMask from "../../../src/shared/hooks/use-metamask";
import { useDebouncedCallback } from "use-debounce";

type State = {
  amount: string; // Amount of heroes to mint
  block: string; // Current block number
  blockTimestamp: string; // Current block timestamp
  parentBlockHash: string; // Parent block hash
  targetBlock: string;
  tokenId: string;
  isPastMint: boolean;
  shouldMint: boolean;
};

const PreviewMint: React.FC = () => {
  const { connect, provider, isActive, isLoading, disconnect } = useMetaMask();

  const [state, setState] = useState<State>({
    amount: "", // Amount of heroes to mint
    block: "", // Current block number
    blockTimestamp: "", // Current block timestamp
    parentBlockHash: "", // Parent block hash
    targetBlock: "", // Block number when called mint()
    tokenId: "", // Global token ID
    isPastMint: false,
    shouldMint: false,
  });

  const [heroes, setHeroes] = useState<Hero[]>();

  const [error, setError] = useState("");

  const updateState = (key: keyof State, value: string | boolean) =>
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));

  const _handleChange = (key: keyof State) => (value: string) => {
    updateState(key, value);
  };

  const _handleOnPastCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;

    updateState("isPastMint", checked);
  };

  const _handleOnShouldMintCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;

    updateState("shouldMint", checked);
  };

  const _handleGetLastTokenIdOnClick = async () => {
    const lastTokenId = await getLastTokenId();

    updateState("tokenId", lastTokenId.toString());

    _handleMintOnClick();
  };

  const _handleGetLastBlockNumberOnClick = (key: keyof State) => async () => {
    const lastBlockNumber = await getLastBlockNumber();

    if (key === "targetBlock") {
      updateState("block", Number(+lastBlockNumber + 5).toString());
    }

    updateState(key, lastBlockNumber.toString());
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

      if (state.shouldMint) {
        await mintHero(provider, +state.amount);
      }
    } catch (error: any) {
      console.log("error: ", error);

      setError(error.message);

      return null;
    }
  };

  const _handleTokenProcessRequest = async () => {
    await processTokenRequests(provider);
  };

  const _handleUpdateBlockIdAndToken = async () => {
    await Promise.all([
      _handleGetLastTokenIdOnClick(),
      _handleGetLastBlockNumberOnClick("block")(),
    ]);
  };

  const debounced = useDebouncedCallback((cb: () => void) => cb(), 500);

  React.useEffect(() => {
    const _load = async () => {
      try {
        if (!state.block) return;

        const refBlock = await getBlock(
          new BN(state.block).sub(new BN(256)).toNumber()
        );

        if (!refBlock) {
          throw new Error("This block is too far in the future");
        }

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

        if (parentBlockHash.isZero()) {
          throw new Error("Parent block hash is zero, this is going to fail.");
        }

        debounced(() => {
          updateState("blockTimestamp", result.toString());
          updateState("parentBlockHash", parentBlockHash.toString());
        });

        setError("");
      } catch (e: any) {
        setError(e.message);
      }
    };

    _load();
  }, [state.block]);

  const _handleConnectWalletOnClick = async () => {
    if (!isActive) {
      await connect();
      return;
    } else {
      await disconnect();
    }
  };

  return (
    <div className="flex flex-col gap-6 h-min md:w-3/4">
      <Button disabled={isLoading} onClick={_handleConnectWalletOnClick}>
        {!isActive ? "Connect metamask" : "Disconnect"}
      </Button>

      <Box className="flex flex-col gap-6">
        {error && <Alert type="error" message={error} />}

        <div className="sm:flex sm:flex-col md:flex-row md:gap-4">
          <Input
            id={"amount"}
            className="md:w-64"
            value={state.amount}
            onChange={_handleChange("amount")}
            primary="Heroes to be minted"
            placeholder="Amount"
          />

          <div className="flex flex-col lg:w-1/6 lg:flex-1">
            <Input
              id={"targetBlock"}
              value={state.targetBlock}
              onChange={_handleChange("targetBlock")}
              primary="Request target block"
              placeholder="Block number when called mint()"
            />

            <Button onClick={_handleGetLastBlockNumberOnClick("targetBlock")}>
              Get last block number
            </Button>
          </div>

          <div className="flex flex-col lg:w-1/6 lg:flex-1">
            <Input
              className="w-full"
              id={"tokenId"}
              value={state.tokenId}
              onChange={_handleChange("tokenId")}
              primary="Token ID"
              placeholder="Token ID"
            />

            <Button onClick={_handleGetLastTokenIdOnClick}>
              Get last token id
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:w-2/4">
          <Input
            className=""
            id={"block"}
            value={state.block}
            onChange={_handleChange("block")}
            primary="Block number"
            placeholder="Block number when called processTokenRequest()"
          />

          <div className="flex gap-4">
            <Button
              onClick={_handleGetLastBlockNumberOnClick("block")}
              className="w-full"
            >
              Get last block number
            </Button>

            <Button
              onClick={() => {
                updateState("block", Number(+state.block + 1).toString());
                _handleMintOnClick();
              }}
              className="w-full"
            >
              +1
            </Button>

            <Button
              onClick={() => {
                updateState("block", Number(+state.block + 5).toString());
                _handleMintOnClick();
              }}
              className="w-full"
            >
              +5
            </Button>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-2">
          <Checkbox
            checked={state.isPastMint}
            onChange={_handleOnPastCheck}
            label="Does this happened in the past?"
          />

          <Checkbox
            checked={state.shouldMint}
            onChange={_handleOnShouldMintCheck}
            label="Should mint?"
          />

          <Button onClick={_handleMintOnClick}>Mint</Button>

          <Button onClick={_handleUpdateBlockIdAndToken}>
            Update last token id and block number
          </Button>

          <Button onClick={_handleTokenProcessRequest}>
            Process token request
          </Button>
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
