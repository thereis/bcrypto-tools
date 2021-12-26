import React, { useState } from "react";

/**
 * Dependencies
 */
import classnames from "classnames";
import { getAccountByNftId } from "../../../../core/bhero";
import Alert from "../Alert";
import Box from "../Box";
import Button from "../Button";
import Input from "../Input";

type Props = {
  onAddressFound: (address: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

const AddressFinder: React.FC<Props> = ({
  onAddressFound,
  className,
  ...props
}) => {
  const [nftId, setNftId] = useState<string>("");

  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>("");

  const _handleChangeNftId = (event: React.FormEvent<HTMLInputElement>) => {
    setNftId(event.currentTarget.value);
  };

  const _handleGetAccountByNft = async () => {
    try {
      setIsFetching(true);
      const found = await getAccountByNftId(nftId);

      onAddressFound(found);
      setError("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Box className={className} {...props}>
      {error && <Alert type="error" message={error} />}

      <Input
        id={"nftId"}
        label="Get wallet address by NFT ID"
        value={nftId}
        onChange={_handleChangeNftId}
        placeholder="NFT id"
        disabled={isFetching}
      />

      <Button onClick={_handleGetAccountByNft} disabled={isFetching || !nftId}>
        Fetch
      </Button>
    </Box>
  );
};

export default AddressFinder;
