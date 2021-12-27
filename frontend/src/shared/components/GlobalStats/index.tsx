import React, { useRef, useState } from "react";

/**
 * Dependencies
 */
import { Web3Service } from "../../../core/web3";
import { getBHeroContract } from "../../../core/bhero";
import {
  bytes32ToBN,
  getBlockHash,
  toBlockNumber,
} from "../../../core/blockhash";

/**
 * Components
 */
import Box from "../Box";
import ListGroup from "../ListGroup";
import ListItem from "../ListItem";

const TIMER = 750;

const GlobalStats: React.FC = () => {
  const provider = Web3Service.getWeb3();

  const [currentBlockNumber, setCurrentBlockNumber] = useState(0);
  const [timestamp, setTimestamp] = useState<string | number>(0);

  const [tokenIdCount, setTokenIdCount] = useState(0);

  const [parentBlockHash, setParentBlockHash] = useState("");
  const [parentBlockNumber, setParentBlockNumber] = useState(0);

  const currentBlockNumberListener = useRef<NodeJS.Timer>();
  const currentGlobalTokenIdCounter = useRef<NodeJS.Timer>();

  const registerBlockNumberHandler = async () => {
    currentBlockNumberListener.current = setInterval(async () => {
      try {
        const blockNumber = await provider.eth.getBlockNumber();
        const block = await provider.eth.getBlock(blockNumber);

        if (
          !block ||
          !block.timestamp ||
          block.timestamp === null ||
          blockNumber === currentBlockNumber
        )
          return;

        setCurrentBlockNumber(blockNumber);
        setTimestamp(block.timestamp);

        const parentNumber = block.number - 1;
        const parentBlockHash = bytes32ToBN(
          await getBlockHash(toBlockNumber(parentNumber))
        );

        setParentBlockNumber(parentNumber);
        setParentBlockHash(parentBlockHash.toString());
      } catch (e) {
        console.error("registerBlockNumberHandler error: ", e);

        return null;
      }
    }, TIMER);
  };

  const registerGlobalTokenIdCounterHandler = async () => {
    currentGlobalTokenIdCounter.current = setInterval(async () => {
      try {
        const count = await getBHeroContract().methods.tokenIdCounter().call();

        setTokenIdCount(count);
      } catch (e) {
        console.error("registerGlobalTokenIdCounterHandler error: ", e);
        return null;
      }
    }, TIMER);
  };

  const listeners = [
    registerBlockNumberHandler,
    registerGlobalTokenIdCounterHandler,
  ];

  const instances = [
    currentBlockNumberListener.current,
    currentGlobalTokenIdCounter.current,
  ];

  React.useEffect(() => {
    const _load = async () =>
      await Promise.all(listeners.map((listener) => listener()));

    _load();

    return () => {
      instances.forEach((instance) => {
        if (instance) {
          clearInterval(instance);
        }
      });
    };
  }, []);

  return (
    <Box className="flex flex-col md:w-1/4 h-min">
      <h1 className="text-white text-lg mb-2">Blockchain Stats</h1>
      <h1 className="text-gray-300 text-sm mb-2">
        Current blockchain stats updated every 1.5s
      </h1>

      <ListGroup className="flex w-full">
        <ListItem
          primary="Last executed block"
          secondary={currentBlockNumber}
        />

        <ListItem primary="Last block timestamp" secondary={timestamp} />

        <ListItem primary="Last minted token id" secondary={tokenIdCount} />

        <ListItem primary="Parent block id" secondary={parentBlockNumber} />

        <ListItem
          primary="Parent block hash"
          secondary={parentBlockHash}
          isLast
        />
      </ListGroup>
    </Box>
  );
};

export default GlobalStats;
