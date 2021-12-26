import BN from "bn.js";

export class CreateTokenRequest {
  targetBlock!: BN; // Use future block.
  count!: number; // Amount of tokens to mint.
  rarity!: number; // 0: random rarity, 1 - 6: specified rarity.

  constructor(params?: Partial<CreateTokenRequest>) {
    Object.assign(this, params);
  }
}
