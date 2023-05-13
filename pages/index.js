import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { DEFAULT_ADDRESS } from "@/helpers/constants";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push(`/transactions/${DEFAULT_ADDRESS}`);
  }, [router]);

  return <div></div>;
}
