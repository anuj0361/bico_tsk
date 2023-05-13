import React from "react";

import { Box, Flex, Center, Text } from "@chakra-ui/react";
import Details from "./Detail";

export default function TxnDetails() {
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
          Transaction Details
        </Text>
      </Center>
      <Box
        border={"1px"}
        borderColor={"gray.300"}
        borderRadius={"10px"}
        padding={2}
        marginBottom={5}
      >
        <Details />
      </Box>
    </Flex>
  );
}
