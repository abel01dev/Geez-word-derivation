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
   <Box
  w="100vw"
  px={4}
  py={4}
bg={useColorModeValue("rgba(245, 245, 245, 1)", "#000000")}
>
  <VStack spacing={6} bg="#F8CD76" p={5} borderRadius="4xl" boxShadow="xl">
    <Flex
      w="full"
      direction={{ base: "column", md: "row" }}
     // h="200px"
     // mb={{base: 4, md:0}}
      align="center"
      justify="space-between"
     // px={4}
     // flexDir={{ base: "column", sm: "row" }}
    >
<Flex justify="flex-start" flex="1">
  <Link to="/">
    <Image
      src="/Mask group.png"
      alt="Ge'ez Logo"
      boxSize={{ base: "100px", md: "150px", lg: "200px" }}
      borderRadius="6xl"
      p={2}
      cursor="pointer"
      mb={{ base: 2, md: 0 }}
    />
  </Link>
</Flex>
  <Box flex="1" textAlign={{ base: "center", md: "center" }} mb={{ base: 4, md: 0 }}>
          <Text
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="bold"
             sx={{
    color: "black",
    animation: "rotateFade 5s ease-in-out infinite",
    display: "inline-block", // required for transform
  }}
>
  Ge’ez Word Derivation
</Text>
            <Text mt={1} fontSize={{ base: "sm", md: "md" }} color="gray.700">
              Quickly generate word forms and see how ancient Ge’ez words are built.
            </Text>
          </Box>
          <HStack spacing={2} position={{ base: "absolute", md: "static" }}
    top={{ base: "1", md: "auto" }}
    right={{ base: "1", md: "auto" }}
    mt={{ base: 0, md: 0 }}
   zIndex="1"
   p={2}
  > 
            <Link to={"/about"}>
              <Button aria-label="Information"  borderRadius="3xl" size={{base:"xs", md:"sm"}}>
                <FaCircleInfo />
              </Button>
            </Link>
 
            <ClientOnly fallback={<Skeleton boxSize="8" />}>
              <IconButton
                onClick={toggleColorMode}
                variant="outline"
  size={{ base: "xs", md: "sm" }}
               
                borderRadius="3xl"
                aria-label="Toggle Color Mode"
             icon={colorMode === "light" ? <LuSun /> : <LuMoon />}  >
              </IconButton>
            </ClientOnly>
          </HStack>
        </Flex>
      </VStack>
      <style>
  {`
    @keyframes rotateFade {
      0% {
        transform: translateX(100%) rotateY(90deg);
        opacity: 0;
      }
      25% {
        transform: translateX(0) rotateY(0deg);
        opacity: 1;
      }
      75% {
        transform: translateX(0) rotateY(0deg);
        opacity: 1;
      }
      100% {
        transform: translateX(-100%) rotateY(-90deg);
        opacity: 0;
      }
    }
  `}
</style>

    </Box>
  );
};

export default Navbar;
