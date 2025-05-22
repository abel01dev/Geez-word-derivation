import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Flex,
  Image,
  Text,
  VStack,
  HStack,
  IconButton,
  Skeleton,
  useColorMode,
  useColorModeValue,
  
} from "@chakra-ui/react";
import { FaCircleInfo } from "react-icons/fa6";
//import { MdContactSupport } from "react-icons/md";
import { Link } from "react-router-dom";
import { LuMoon, LuSun } from "react-icons/lu";


// Custom ClientOnly component
function ClientOnly({ children, fallback = null }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return fallback;
  }
  return <>{children}</>;
}

const Navbar = () => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <Box w="100vw" px={4} py={4} bg={useColorModeValue("#F5F5F5.100", "gray.200")}>
      <VStack spacing={6} bg="#F8CD76" p={5} borderRadius="4xl" boxShadow="xl">
        <Flex
          w="full"
          h="200px"
          mx="auto"
          align="center"
          justify="space-between"
          px={4}
          flexDir={{ base: "column", sm: "row" }}
        >
          <Link to="/">
            <Image
              src="/Mask group.png" // Place this in public/
              alt="Ge'ez Logo"
              boxSize="250px"
              borderRadius="6xl"
              position="absolute"
              top="5"
              left="0"
              p={4}
              cursor="pointer"
            />
          </Link>
          <Box position="absolute" top="40" w="full" textAlign="center">
          <Text
              fontSize="4xl"
              fontWeight="bold"
              sx={{
                backgroundImage:
                  "linear-gradient(270deg,rgb(128, 71, 7),rgba(206, 17, 17, 0),rgba(82, 83, 7, 0.27),rgb(143, 45, 0),rgb(156, 94, 0))",
                backgroundSize: "1000% 100%",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                animation: "gradientMove 6s ease infinite",
              }}
            >
              Ge’ez Word Derivation
            </Text>
            <Text fontSize="15px" color="gray.700">
              Quickly generate word forms and see how ancient Ge’ez words are built.
            </Text>
          </Box>
          <HStack spacing={4}>
            <Link to={"/about"}>
              <Button aria-label="Information" top="-20" left="5" borderRadius="3xl">
                <FaCircleInfo />
              </Button>
            </Link>
 
            <ClientOnly fallback={<Skeleton boxSize="8" />}>
              <IconButton
                onClick={toggleColorMode}
                variant="outline"
                size="sm"
                top="-20"
                left="5"
                borderRadius="3xl"
                aria-label="Toggle Color Mode"
              >
                {colorMode === "light" ? <LuSun /> : <LuMoon />}
              </IconButton>
            </ClientOnly>
          </HStack>
        </Flex>
      </VStack>
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </Box>
  );
};

export default Navbar;
