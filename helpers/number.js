import { formatUnits, parseUnits } from "ethers";
import { TOKEN_DEFAULT_DECIMALS } from "./constants";
import { BigNumber } from "@ethersproject/bignumber";

export const formatBalance = (
  bal,
  decimals = TOKEN_DEFAULT_DECIMALS,
  precision = 6
) => {
  return Number(formatUnits(bal, decimals)).toFixed(precision);
};

export const multiplyTwoBigNum = (
  num1,
  num2,
  decimals = TOKEN_DEFAULT_DECIMALS
) => {
  const total = num1.mul(num2);

  return formatUnits(total.toString(), decimals);
};
