import React, { useReducer, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  txnDetailsReducer,
  FETCH_TXNS_DETAILS,
} from "@/reducers/txnDetailsReducer";

export default function TxnDetails() {
  const router = useRouter();
  const [state, dispatch] = useReducer(txnDetailsReducer, {
    loading: true,
    details: null,
    error: false,
  });

  const fetchTransactions = async (hash) => {
    try {
      const ethTxnPromise = await axios.get(
        `${process.env.ETH_HOST}?module=transaction&action=getstatus&txhash=${hash}&apikey=${process.env.ETH_API_KEY}`
      );
      const polyTxnPromise = await axios.get(
        `${process.env.POLYGON_HOST}?module=transaction&action=gettxreceiptstatus&txhash=${hash}&apikey=${process.env.POLY_API_KEY}`
      );
      const [ethTxnDetails, polyTxnDetails] = await Promise.allSettled([
        ethTxnPromise,
        polyTxnPromise,
      ]);

      //   dispatch({
      //     type: FETCH_TXNS_DETAILS,
      //     payload: {
      //       loading: false,
      //       txns: [
      //         ...ethTxns.value?.data?.result,
      //         ...polyTxns.value?.data?.result,
      //       ],
      //       error: false,
      //     },
      //   });
    } catch (e) {
      //   dispatch({
      //     type: FETCH_TXNS,
      //     payload: {
      //       loading: false,
      //       txns: [],
      //       error: true,
      //     },
      //   });
    }
  };

  useEffect(() => {
    if (router.query && router.query.hash) {
      const { hash } = router.query;
      fetchTransactions(hash);
    }
  }, [router.query]);

  console.log("state", state);

  return <div>index</div>;
}
