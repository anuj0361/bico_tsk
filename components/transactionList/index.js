import React from "react";
import { Flex, Box, Center, Text } from "@chakra-ui/react";

import TxnTable from "./Table";
import Balance from "./Balance";

export default function TxnList() {
  return (
    <Flex
      bg={"gray.100"}
      width={"100%"}
      height={"100vh"}
      padding={5}
      flexDirection={"column"}
    >
      <Center padding={2} marginBottom={5}>
        <Text fontSize={25} fontWeight={"bold"}>
          Transactions List
        </Text>
      </Center>
      <Box
        border={"1px"}
        borderColor={"gray.300"}
        borderRadius={"10px"}
        padding={2}
        marginBottom={5}
      >
        <Balance />
      </Box>
      <Box
        border={"1px"}
        borderColor={"gray.300"}
        borderRadius={"10px"}
        padding={2}
      >
        <TxnTable />
      </Box>
    </Flex>
  );
}
