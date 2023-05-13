import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { DEFAULT_HASH } from "@/helpers/constants";

export default function TxnDetailsHome() {
  const router = useRouter();

  useEffect(() => {
    router.push(`/transactions/details/${DEFAULT_HASH}`);
  }, [router]);

  return <div></div>;
}
