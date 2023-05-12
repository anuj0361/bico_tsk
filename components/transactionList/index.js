import React, { useReducer, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { txnListReducer, FETCH_TXNS } from "@/reducers/txnListReducer";
import {
  Box,
  Spinner,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Center,
  Flex,
} from "@chakra-ui/react";
import Link from "next/link";

import { epochToDatenTime } from "@/helpers/date";

export default function TxnList() {
  const router = useRouter();
  const [state, dispatch] = useReducer(txnListReducer, {
    loading: true,
    txns: [],
    error: false,
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
          loading: false,
          txns: [
            ...ethTxns.value?.data?.result,
            ...polyTxns.value?.data?.result,
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
        height={"100vh"}
        alignItems={"center"}
        justifyContent={"center"}
        bg={"gray.100"}
      >
        <Spinner />
      </Flex>
    );
  }

  if (!state.loading && !state.txns.length) {
    return (
      <Box>
        <Text>No Transactions Found</Text>
      </Box>
    );
  }

  return (
    <Flex
      bg={"gray.100"}
      width={"100%"}
      height={"100vh"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Center>
        {" "}
        <TableContainer
          border={"1px"}
          borderColor={"gray.300"}
          borderRadius={"10px"}
          padding={2}
          overflowY={"scroll"}
          maxHeight={"700px"}
        >
          <Table variant="simple">
            <TableCaption>Transactions</TableCaption>
            <Thead>
              <Tr>
                <Th>Sr No.</Th>
                <Th>Amount</Th>
                <Th>Timestamp</Th>
                <Th>Block Number</Th>
                <Th>Method</Th>
                <Th isNumeric>More Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              {state.txns.map((txn, index) => (
                <Tr key={txn.hash}>
                  <Td>{index + 1}</Td>
                  <Td>{txn.value}</Td>
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
      </Center>
    </Flex>
  );
}
