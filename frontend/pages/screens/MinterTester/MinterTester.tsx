import React from "react";
import { getBHeroContract } from "../../../core/bhero";
import { decode } from "../../../core/bhero/decode";
import { Web3Service } from "../../../core/web3";

import { AutoSizer, Column, Grid, Table } from "react-virtualized";
import { Hero } from "../../../core/models/hero";

import "react-virtualized/styles.css";

const MinterTester: React.FC = () => {
  const [amount, setAmount] = React.useState(0);
  const [loggerEventEmitter, setLoggerEventEmitter] = React.useState<any>(null);

  const [heroes, setHeroes] = React.useState<Hero[]>([]);

  const unsubscribeLogger = React.useCallback(() => {
    if (loggerEventEmitter) {
      loggerEventEmitter.unsubscribe();

      setLoggerEventEmitter(null);
    }
  }, [loggerEventEmitter]);

  React.useEffect(() => {
    return () => {
      unsubscribeLogger();
    };
  }, []);

  const _handleStartLogger = () => {
    if (loggerEventEmitter) {
      return unsubscribeLogger();
    }

    const contract = getBHeroContract();

    const event = contract.events
      .TokenCreated({}, (error, event) => {
        event && _handleCreatedHero(event);
      })
      .on("connected", (subscriptionId: string) => {
        console.log("connected: ", subscriptionId);
      })
      //   .on("data", _handleCreatedHero)
      .on("error", (error: any) => {
        console.log({ error });
      });

    setLoggerEventEmitter(event);
  };

  const _handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseInt(e.target.value) || 0);
  };

  const _handleCreatedHero = async (event: any) => {
    const {
      returnValues: { details },
    } = event;

    const hero = decode(details);
    console.log("hero: ", hero);

    console.log(heroes.length);
    setHeroes((prevHeroes) => [...prevHeroes, hero]);
  };

  return (
    <div className="container">
      <h1>MinterTester</h1>

      <div>
        <div>Live logger</div>

        <div>
          <button
            className="border border-gray-400 rounded-lg p-2"
            onClick={_handleStartLogger}
          >
            {!loggerEventEmitter ? "Start" : "Stop"}
          </button>
        </div>

        <div>
          <p>Heroes minted {heroes.length}</p>

          <AutoSizer>
            {({ height, width }) => (
              <Table
                headerHeight={height}
                rowHeight={height}
                rowCount={heroes.length}
                height={height}
                width={width}
                rowGetter={({ index }) => heroes[index]}
              >
                <Column label="Name" dataKey="name" width={100} />
                <Column width={200} label="Description" dataKey="description" />
              </Table>
            )}
          </AutoSizer>
        </div>
      </div>

      <div className="flex flex-row gap-10 mt-10     mb-10">
        <div>
          <p>Contract infos</p>
          <span>
            Last token id: <b>tokenId</b>
          </span>
        </div>

        <div>
          <p>Current execution</p>
          <span>
            Generated seed: <b>seed</b>
          </span>
        </div>
      </div>

      <div>
        <h2>Amount to mint</h2>

        <div className="flex flex-row gap-2">
          <input
            className="border border-black rounded-lg w-1/2"
            value={amount}
            type="text"
            onChange={_handleAmount}
          />

          <button className="border border-gray-400 rounded-lg p-2">
            Mint
          </button>
        </div>
      </div>
    </div>
  );
};

export default MinterTester;
