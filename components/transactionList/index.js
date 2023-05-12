import React, { useReducer, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { txnListReducer, FETCH_TXNS } from "@/reducers/txnListReducer";

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
        `${process.env.ETH_HOST}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.ETH_API_KEY}`
      );
      const polyTxnsPromise = await axios.get(
        `${process.env.POLYGON_HOST}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.POLY_API_KEY}`
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

  console.log("state", state);

  return <div>index</div>;
}
