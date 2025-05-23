// src/components/Footer.js
import { Box, Text, Flex, Link } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box bg="gray.700" color="white" py={4} mt={10}>
      <Flex
        maxW="1200px"
        mx="auto"
        px={6}
        justify="space-between"
        align="center"
        direction={{ base: "column", md: "row" }}
        textAlign={{ base: "center", md: "left" }}
        gap={2}
      >
        <Text>&copy; {new Date().getFullYear()} SmartVoice. All rights reserved.</Text>
        <Flex gap={4}>
          <Link href="/about" color="blue.200">About</Link>
          <Link href="/support" color="blue.200">Support</Link>
          <Link href="/privacy" color="blue.200">Privacy</Link>
        </Flex>
      </Flex>
    </Box>
  );
}
