import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import { FETCH_BALANCES, balanceReducer } from "@/reducers/balanceReducer";
import { formatBalance } from "@/helpers/number";
import { CHAINS, TOKEN_SYMBOLS } from "@/helpers/constants";

export default function Balance() {
  const router = useRouter();
  const [state, dispatch] = useReducer(balanceReducer, {
    loading: true,
    eth: null,
    poly: null,
    error: false,
  });

  const fetchBalance = async (address) => {
    try {
      const ethBPromise = await axios.get(
        `${process.env.ETH_HOST}?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.ETH_API_KEY}`
      );
      const polyBPromise = await axios.get(
        `${process.env.POLYGON_HOST}?module=account&action=balance&address=${address}&apikey=${process.env.POLY_API_KEY}`
      );
      const [ethTxns, polyTxns] = await Promise.allSettled([
        ethBPromise,
        polyBPromise,
      ]);

      dispatch({
        type: FETCH_BALANCES,
        payload: {
          loading: false,
          eth: ethTxns.value?.data?.result,
          poly: polyTxns.value?.data?.result,
          error: false,
        },
      });
    } catch (e) {
      dispatch({
        type: FETCH_BALANCES,
        payload: {
          loading: false,
          eth: null,
          poly: null,
          error: true,
        },
      });
    }
  };

  useEffect(() => {
    if (router.query && router.query.address) {
      const { address } = router.query;
      fetchBalance(address);
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

  //ToDo useCallBack
  const renderBalance = (detail, type) => {
    return (
      <Flex paddingTop={2}>
        <Text fontWeight={"bold"}>{`Balance on ${
          type === CHAINS.POLY ? CHAINS.POLY : CHAINS.ETH
        }`}</Text>
        <Text paddingLeft={4}>
          {formatBalance(detail)}{" "}
          {type === CHAINS.POLY ? TOKEN_SYMBOLS.MATIC : TOKEN_SYMBOLS.ETH}
        </Text>
      </Flex>
    );
  };

  return (
    <Box>
      <Text fontSize={20} fontWeight={"bold"}>{`Summary`}</Text>
      <Flex paddingTop={2}>
        <Text fontWeight={"bold"}>{`Address`}</Text>
        <Text paddingLeft={4} wordBreak={"break-all"}>
          {router?.query?.address}
        </Text>
      </Flex>
      {state && state.poly ? renderBalance(state.poly, CHAINS.POLY) : null}
      {state && state.eth ? renderBalance(state.eth, CHAINS.ETH) : null}
      {!state.poly && !state.eth ? (
        <Text
          paddingTop={6}
          fontWeight={"bold"}
        >{`No balance found on ETH & Polygon chain`}</Text>
      ) : null}
    </Box>
  );
}
