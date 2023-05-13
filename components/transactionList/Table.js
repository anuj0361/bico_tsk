import React, { useEffect, useReducer } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";

import { epochToDatenTime } from "@/helpers/date";
import {
  CHAINS,
  SORT_DIRECTION,
  SORT_OPTION,
  TOKEN_SYMBOLS,
} from "@/helpers/constants";
import { FETCH_TXNS, SORT_BY, txnListReducer } from "@/reducers/txnListReducer";
import { formatBalance } from "@/helpers/number";

export default function TxnTable() {
  const router = useRouter();
  const [state, dispatch] = useReducer(txnListReducer, {
    loading: true,
    txns: [],
    error: false,
    sortDirection: SORT_DIRECTION.ASC,
    sortType: SORT_OPTION.TIME,
  });

  const fetchTransactions = async (address) => {
    try {
      const ethTxnsPromise = await axios.get(
        `${process.env.ETH_HOST}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${process.env.ETH_API_KEY}`
      );
      const polyTxnsPromise = await axios.get(
        `${process.env.POLYGON_HOST}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${process.env.POLY_API_KEY}`
      );
      const [ethTxns, polyTxns] = await Promise.allSettled([
        ethTxnsPromise,
        polyTxnsPromise,
      ]);

      dispatch({
        type: FETCH_TXNS,
        payload: {
          sortDirection: SORT_DIRECTION.ASC,
          sortType: SORT_OPTION.TIME,
          loading: false,
          txns: [
            ...ethTxns.value?.data?.result.map((el) => {
              return {
                ...el,
                chain: CHAINS.ETH,
              };
            }),
            ...polyTxns.value?.data?.result.map((el) => {
              return {
                ...el,
                chain: CHAINS.POLY,
              };
            }),
          ],
          error: false,
        },
      });
    } catch (e) {
      dispatch({
        type: FETCH_TXNS,
        payload: {
          loading: false,
          txns: [],
          error: true,
          sortDirection: SORT_DIRECTION.ASC,
          sortType: SORT_OPTION.TIME,
        },
      });
    }
  };

  useEffect(() => {
    if (router.query && router.query.address) {
      const { address } = router.query;
      fetchTransactions(address);
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
  const getSortedTxns = () => {
    if (!state.txns.length) return [];

    if (state.sortType === SORT_OPTION.TIME) {
      if (state.sortDirection === SORT_DIRECTION.ASC) {
        return [...state.txns?.sort((a, b) => a.timeStamp - b.timeStamp)];
      }
      return [...state.txns?.sort((a, b) => b.timeStamp - a.timeStamp)];
    }

    if (state.sortDirection === SORT_DIRECTION.ASC) {
      return [
        ...state.txns?.sort(
          (a, b) => formatBalance(a.value) - formatBalance(b.value)
        ),
      ];
    }
    return [
      ...state.txns?.sort(
        (a, b) => formatBalance(b.value) - formatBalance(a.value)
      ),
    ];
  };

  //TODO useCallBack
  const getSortIcon = () => {
    if (state.sortDirection === SORT_DIRECTION.ASC) return <ArrowUpIcon />;
    return <ArrowDownIcon />;
  };

  const sortedList = getSortedTxns();
  const sortIcon = getSortIcon();

  return (
    <TableContainer overflowY={"scroll"} maxHeight={"700px"}>
      <Table variant="simple" size={"sm"}>
        <TableCaption>{`${
          sortedList.length ? "Transactions" : "No Transactions Found"
        } `}</TableCaption>
        <Thead>
          <Tr>
            <Th>Sr No.</Th>
            <Th>Chain</Th>
            <Th
              onClick={() =>
                dispatch({
                  type: SORT_BY,
                  payload: {
                    sortDirection:
                      state.sortDirection === SORT_DIRECTION.ASC
                        ? SORT_DIRECTION.DSC
                        : SORT_DIRECTION.ASC,
                    sortType: SORT_OPTION.AMOUNT,
                  },
                })
              }
            >
              Amount {state.sortType === SORT_OPTION.AMOUNT ? sortIcon : null}
            </Th>
            <Th
              onClick={() =>
                dispatch({
                  type: SORT_BY,
                  payload: {
                    sortDirection:
                      state.sortDirection === SORT_DIRECTION.ASC
                        ? SORT_DIRECTION.DSC
                        : SORT_DIRECTION.ASC,
                    sortType: SORT_OPTION.TIME,
                  },
                })
              }
            >
              Timestamp {state.sortType === SORT_OPTION.TIME ? sortIcon : null}
            </Th>
            <Th>Block Number</Th>
            <Th>Method</Th>
            <Th>More Details</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedList.map((txn, index) => (
            <Tr key={txn.hash}>
              <Td>{index + 1}</Td>
              <Td>{txn.chain}</Td>
              <Td>
                {formatBalance(txn.value)}{" "}
                {txn.chain === CHAINS.ETH
                  ? TOKEN_SYMBOLS.ETH
                  : TOKEN_SYMBOLS.MATIC}
              </Td>
              <Td>{epochToDatenTime(txn.timeStamp)}</Td>
              <Td>{txn.blockNumber}</Td>
              <Td>{txn.functionName.split("(")[0]}</Td>
              <Td color={"blue.400"}>
                <Link href={`/transactions/details/${txn.hash}`}>
                  <u>Details</u>
                </Link>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
