import React, { useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  txnDetailsReducer,
  FETCH_TXNS_DETAILS,
} from "@/reducers/txnDetailsReducer";
import { Box, Flex, Center, Text, Spinner } from "@chakra-ui/react";
import Link from "next/link";
import { BigNumber } from "@ethersproject/bignumber";
import { CHAINS, TOKEN_SYMBOLS } from "@/helpers/constants";
import { formatBalance, multiplyTwoBigNum } from "@/helpers/number";
import { epochToDatenTime } from "@/helpers/date";

export default function Details() {
  const router = useRouter();
  const [state, dispatch] = useReducer(txnDetailsReducer, {
    loading: true,
    ethDetails: null,
    polyDetails: null,
    error: false,
  });

  const fetchTransactions = async (hash) => {
    try {
      const ethTxnPromise = await axios.get(
        `${process.env.ETH_HOST}?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=${process.env.ETH_API_KEY}`
      );
      const polyTxnPromise = await axios.get(
        `${process.env.POLYGON_HOST}?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=${process.env.POLY_API_KEY}`
      );
      const [ethTxnDetails, polyTxnDetails] = await Promise.allSettled([
        ethTxnPromise,
        polyTxnPromise,
      ]);

      dispatch({
        type: FETCH_TXNS_DETAILS,
        payload: {
          loading: false,
          ethDetails: ethTxnDetails.value?.data?.result,
          polyDetails: polyTxnDetails.value?.data?.result,
          error: false,
        },
      });
    } catch (e) {
      dispatch({
        type: FETCH_TXNS_DETAILS,
        payload: {
          loading: false,
          ethDetails: null,
          polyDetails: null,
          error: true,
        },
      });
    }
  };

  useEffect(() => {
    if (router.query && router.query.hash) {
      const { hash } = router.query;
      fetchTransactions(hash);
    }
  }, [router.query]);

  if (state.loading) {
    return (
      <Flex
        width={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
        bg={"gray.100"}
        paddingTop={15}
        paddingBottom={15}
      >
        <Spinner />
      </Flex>
    );
  }

  //TODO useCallBack
  const renderTxnInfo = (details, type) => {
    return (
      <Flex paddingTop={6} flexDirection={"column"}>
        <Flex>
          <Text fontWeight={"bold"} minWidth={100}>{`Chain`}</Text>
          <Text paddingLeft={4} wordBreak={"break-all"}>
            {type === CHAINS.ETH ? CHAINS.ETH : CHAINS.POLY}
          </Text>
        </Flex>
        <Flex paddingTop={2}>
          <Text fontWeight={"bold"} minWidth={100}>{`Txn Hash`}</Text>
          <Text paddingLeft={4} wordBreak={"break-all"}>
            {details?.hash}
          </Text>
        </Flex>
        <Flex paddingTop={2}>
          <Text fontWeight={"bold"} minWidth={100}>{`Txn Link`}</Text>
          <Text paddingLeft={4} color={"blue.400"}>
            <a
              target="_blank"
              href={`${
                type === CHAINS.POLY
                  ? process.env.POLY_BLOCK_URL
                  : process.env.ETH_BLOCK_URL
              }/tx/${details?.hash}`}
            >
              <u>Goto Explorer</u>
            </a>
          </Text>
        </Flex>
        <Flex paddingTop={2}>
          <Text fontWeight={"bold"} minWidth={100}>{`Amount`}</Text>
          <Text paddingLeft={4}>
            {formatBalance(details?.value.toString())}{" "}
            {type === CHAINS.POLY ? TOKEN_SYMBOLS.MATIC : TOKEN_SYMBOLS.ETH}
          </Text>
        </Flex>
        <Flex paddingTop={2}>
          <Text fontWeight={"bold"} minWidth={100}>{`Block`}</Text>
          <Text paddingLeft={4}>{details?.blockNumber}</Text>
        </Flex>
        <Flex paddingTop={2}>
          <Text fontWeight={"bold"} minWidth={100}>{`From`}</Text>
          <Text paddingLeft={4} wordBreak={"break-all"}>
            {details?.from}
          </Text>
        </Flex>
        <Flex paddingTop={2}>
          <Text fontWeight={"bold"} minWidth={100}>{`To`}</Text>
          <Text paddingLeft={4} wordBreak={"break-all"}>
            {details?.to}
          </Text>
        </Flex>
        <Flex paddingTop={2}>
          <Text fontWeight={"bold"} minWidth={100}>{`Timestamp`}</Text>
          <Text paddingLeft={4}>{}</Text>
        </Flex>
        <Flex paddingTop={2}>
          <Text fontWeight={"bold"} minWidth={100}>{`Status`}</Text>
          <Text paddingLeft={4}></Text>
        </Flex>
        <Flex paddingTop={2}>
          <Text fontWeight={"bold"} minWidth={100}>{`Fees`}</Text>
          <Text paddingLeft={4}>
            {multiplyTwoBigNum(
              BigNumber.from(details?.gas),
              BigNumber.from(details?.gasPrice)
            )}{" "}
            {type === CHAINS.POLY ? TOKEN_SYMBOLS.MATIC : TOKEN_SYMBOLS.ETH}
          </Text>
        </Flex>
      </Flex>
    );
  };

  return (
    <Box>
      {state && state.polyDetails
        ? renderTxnInfo(state.polyDetails, CHAINS.POLY)
        : null}
      {state && state.ethDetails
        ? renderTxnInfo(state.ethDetails, CHAINS.ETH)
        : null}
      {!state.ethDetails && !state.polyDetails ? (
        <Text
          paddingTop={6}
          fontWeight={"bold"}
        >{`No transaction found on ETH & Polygon chain`}</Text>
      ) : null}
    </Box>
  );
}
