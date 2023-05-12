import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function TxnHome() {
  const router = useRouter();

  useEffect(() => {
    router.push("/transactions/0xebb83B26f452a328bc6C4e3aa458AE3F2DF844C4");
  }, [router]);

  return <div></div>;
}
