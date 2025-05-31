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
//import { LuLanguages } from "react-icons/lu";


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
bg={useColorModeValue("#ffffffcc", "#000000")}
backdropFilter="blur(35px)"
>
  <VStack spacing={6}bgGradient="linear(to-r, #D57500,rgb(189, 151, 115))"
 p={2} borderRadius="4xl" boxShadow="xl">
    <Flex
      w="100%"
      direction={{ base: "column", md: "row" }}
     // h="200px"
     // mb={{base: 4, md:0}}
      align={{ base: "center", md: "center" }}
 justify={{ base: "center", md: "space-between" }}     // px={4}
     // flexDir={{ base: "column", sm: "row" }}
    >
  <Flex align="center" justify="flex-start" w={{ base: "100%", md: "auto" }}>
  <Link to="/">
    <Image
      src="/Mask group.png"
      alt="Ge'ez Logo"
      boxSize={{ base: "70px", md: "350px", lg: "200px" }}
      borderRadius="6xl"
      p={1}
      cursor="pointer"
      mb={{ base:0, md: 0 }}
     
    />
  </Link>
</Flex>
  <Box textAlign={{ base: "center", md: "center" }} mb={{ base: 2, md: 0 }}>
          <Text fontSize={{ base: "lg", md: "3xl" }} fontWeight="bold">
  <Box as="span" className="rotating" color="red.500">Ge’ez</Box>{" "}
  <Box as="span" color="black">Word Derivation</Box>
</Text>

            <Text mt={1} fontSize={{ base: "xs", md: "md" }} color="gray.900"   className="typing-description"
 >
   
            Instantly generate derived verb forms from Ge’ez roots.
       <Box as="span" className="cursor">|</Box>

            </Text>
          </Box>
          <HStack spacing={2} position={{ base: "absolute", md: "static" }}
    top={{ base: "1", md: "auto" }}
    right={{ base: "1", md: "auto" }}
    mt={{ base: 2, md: 0 }}
   zIndex="1"
   p={3}
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
        transform: translateX(0) rotateY(0deg);
        opacity: 1;
        color: red;
      }
      50% {
        transform: translateX(5px) rotateY(360deg);
        opacity: 1;
        color: red;
      }
      100% {
        transform: translateX(0) rotateY(360deg);
        opacity: 1;
        color: red;
      }
    }

    .rotating {
      display: inline-block;
      animation: rotateFade 4s ease-in-out infinite;
    }

    .typing-description {
      width: 0;
      white-space: nowrap;
      overflow: hidden;
      animation: typing 5s steps(60, end) forwards;
      font-family: monospace;
      display: inline-block;
    }

    @keyframes typing {
      from {
        width: 0;
      }
      to {
        width: 100%;
      }
    }

    .cursor {
      display: inline-block;
      opacity: 1;
      animation: blink 1s step-start infinite;
      font-weight: bold;
    }

    @keyframes blink {
      50% {
        opacity: 0;
      }
    }
  `}
</style>


    </Box>
  );
};

export default Navbar;
