import React from "react";

/**
 * Components
 */
import Box from "../../shared/components/Box";
import Input from "../../shared/components/Input";

type State = {
  amount: string; // Amount of heroes to mint
  block: string; // Current block number
  targetBlock: string;
  targetBlockHash: string;
  tokenId: string;
  tokenSeed: string;
};

const PreviewMint: React.FC = () => {
  const [state, setState] = React.useState<State>({
    amount: "1", // Amount of heroes to mint
    block: "0", // Current block number
    targetBlock: "0", // Block number when called mint()
    targetBlockHash: "", // blockhash(targetBlock)
    tokenId: "0", // Global token ID
    tokenSeed: "", // Generated token seed = blockhash(targetBlock, tokenId)
  });

  const _handleChange =
    (key: string) => (e: React.FormEvent<HTMLInputElement>) => {
      const { value } = e.currentTarget;

      setState((prevState) => ({
        ...prevState,
        [key]: value || "",
      }));
    };

  return (
    <>
      <Box className="flex flex-col flex-1">
        <div className="flex gap-4">
          <Input
            id={"amount"}
            value={state.amount}
            onChange={_handleChange("amount")}
            label="Amount of heroes to mint"
            placeholder="Amount"
          />

          <Input
            id={"block"}
            value={state.block}
            onChange={_handleChange("block")}
            label="Current block number"
            placeholder="Block number"
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
            id={"targetBlock"}
            value={state.targetBlock}
            onChange={_handleChange("targetBlock")}
            label="Target block"
            placeholder="Block number when called mint()"
          />

          <Input
            id={"targetBlockHash"}
            value={state.targetBlockHash}
            onChange={_handleChange("targetBlockHash")}
            label="Target block hash"
            placeholder="Target block hash"
          />

          <Input
            id={"tokenSeed"}
            value={state.tokenSeed}
            onChange={_handleChange("tokenSeed")}
            label="Token seed"
            placeholder="Token seed"
          />
        </div>
      </Box>
    </>
  );
};

export default PreviewMint;
