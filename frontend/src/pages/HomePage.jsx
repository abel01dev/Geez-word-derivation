import React, { useState } from "react";
import "./animations.css";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Flex,
  useColorModeValue
} from "@chakra-ui/react";
import axios from "axios";
import { MdContactSupport } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaFileDownload } from "react-icons/fa";


export default function DerivationApp() {
  const [inputWord, setInputWord] = useState("");
  const [ruleId, setRuleId] = useState("");
  const [result, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    //setResults([]);
setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/derive", {
        word: inputWord,
        ruleId,
      });
    setTimeout(() => {
setResults((prev) => [response.data, ...prev]); // Append new result (FIFO)
      setLoading(false);
      }, 2500);
      
    } catch (err) {
     setTimeout(() =>{
      setError(err.response?.data?.error || "An error occurred.");
      setLoading(false); }, 2500); 
    }
  };
  const handlerClear = () => {
    setInputWord("");
    setError("");
    setResults([]);
    setRuleId("");
  }
   // ---- Download as .txt ----
 const downloadAsTxt = () => {
  let content = "";

  result.forEach((res, index) => {
    content += `Derived Word Set #${index + 1}\n`;
    Object.entries(res).forEach(([form, word]) => {
      content += `${form}: ${word}\n`;
    });
    content += `\n`; // Add space between results
  });

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "derived_words.txt";
  link.click();
  URL.revokeObjectURL(url);
};

 


const resultBg = useColorModeValue("white.5000", "gray.500") ;
const formTextColor = useColorModeValue("#D57500", "#FBBF24"); // Amber-400 in dark mode


  return (
<Box
  w="100%"
  minH="100vh"
  py={{ base: 4, md: 8 }}
  px={{ base: 2, md: 6 }}
  bg={useColorModeValue("gray.100", "#121212")}
  color={useColorModeValue("black", "white")}
>
      <Box w="100%" maxW="1200px" mx="auto"    p={{ base: 4, md: 8 }}  borderRadius="xl" >
      <Box as="form" onSubmit={handleSubmit}  maxW="1200px"
        w="100%"
        mx="auto"
px={{ base: 4, md: 8 }} // more breathing room on mobile
  py={{ base: 4, md: 8 }}       bg="#f8f8f8"
        borderRadius="xl"
        boxShadow="md"
        position="relative">
          <Box position="absolute" top={{ base: 8, md: 14 }} right={{ base: 18, md: 14 }}>
    <Link to="/support">
      <Button
        aria-label="Contact Support"
        borderRadius="full"
              size={{ base: "xs", md: "sm" }}

        colorScheme="teal">
        <MdContactSupport />
      
      </Button>
    </Link>
  </Box>
        <VStack spacing={4} align="stretch">
          {/* Simulating a fieldset using Box */}
          <Box border="1px solid" borderColor="gray.200" p={4} borderRadius="35" bg="#FDDB92">
            <Text textAlign="center"   fontSize={{ base: "x", md: "3xl" }}
 fontWeight="bold" mb={{base:21, md:16}}>Enter your Root Word And Rule</Text>
              <Box
  w={{ base: "100%", md: "600px" }} // shorter width container
  mx="auto"
  p={{base:4, md:4}}
  //bg="white"
  borderRadius="md"
  boxShadow="sm"
  bg={{ base: "gray.100", md: "gray.300" }}
  mb={{ base: 4, md: 6 }}
>
  <Flex gap={4} align="center">
    <FormControl isRequired flex="1">
      <FormLabel fontSize={{ base: "sm", md: "md" }}>Ge'ez Root Word</FormLabel>
      <Input
          size={{ base: "sm", md: "md" }}
        placeholder="Enter Ge'ez root word"
        value={inputWord}
        onChange={(e) => setInputWord(e.target.value)}
      />
    </FormControl>

    <FormControl isRequired flex="1">
      <FormLabel fontSize={{ base: "sm", md: "md" }}>Rule</FormLabel>
      <Select
          size={{ base: "sm", md: "md" }}

        placeholder="Select Rule"
        value={ruleId}
        onChange={(e) => setRuleId(e.target.value)}
      >
        <option value="1">ቀተለ (Rule 1)</option>
        <option value="2">ቀደሰ (Rule 2)</option>
        <option value="3">ተንበለ (Rule 3)</option>
        <option value="4">ባረከ (Rule 4)</option>
        <option value="5">ማህረከ (Rule 5)</option>
        <option value="6">ሴሰየ (Rule 6)</option>
        <option value="7">ክህለ (Rule 7)</option>
        <option value="8">ጦመረ (Rule 8)</option>
      </Select>
    </FormControl>
  </Flex>
</Box>
            <Flex justifyContent="flex-end" mt="auto" gap={2} irection={{ base: "column", md: "row" }}>
            
              <Button
                type="submit"
                colorScheme="blue"
                position="relative"
    size={{ base: "sm", md: "md" }}
    width={{ base: "100%", md: "150px" }}
                isLoading={loading}
                isDisabled={loading}
                loadingText="Generating..."
              >
                {loading ? "Generating..." : "Generate"}
              </Button>
                          <Button
    colorScheme="gray"
    onClick={handlerClear}
    isDisabled={loading}
    size={{ base: "sm", md: "md" }}
    width={{ base: "100%", md: "auto" }}
  >
  Clear All
</Button>

            </Flex>
            {
              loading && (
                <Box display="flex" justifyContent="center" mt={6}>
                  <div className="ring"></div>
                  </Box>
              )
            }
          </Box>
        </VStack>
      </Box>

      {/* Result section */}
      {result.length > 0 && !loading && result.map ((result, index) => (
        <Box key={index} mt={8}  bg={resultBg}


         color="white"
          py={6}
          px={4}
          maxW="1500px"
          w="90%"
          mx="auto"
          borderRadius="xl"
          boxShadow="lg">
          <Text fontSize="lg" fontWeight="semibold" mb={2}>
            {index }
          </Text>
           <Flex gap={4} mb={4} justifyContent="flex-end" wrap="wrap">
            <Button onClick={downloadAsTxt} size="sm" colorScheme="red">
             <FaFileDownload />
            </Button>
           
          
          </Flex>
          <Table variant="simple" size={{base: "sm", md: "md"}}>
           <Thead>
  <Tr>
    <Th 
bgGradient="linear(to-r, orange.300, yellow.200)"
color="gray.800"
fontWeight="bold"
    //  color="black"
      fontSize={{ base: "sm", md: "md" }}
     // fontWeight="bold"
    >
      Form
    </Th>
    <Th 
bgGradient="linear(to-l, orange.300, yellow.200)"
color="gray.800"
fontWeight="bold"
    //  color="black"
      fontSize={{ base: "sm", md: "md" }}
    //  fontWeight="bold"
    >
      Derived Word
    </Th>
  </Tr>
</Thead>

            <Tbody>
              {Object.entries(result).map(([form, value]) => (
                <Tr key={form}>
<Td fontSize={{ base: "sm", md: "sm" }} color={formTextColor}>
  {form}
</Td>
                  <Td fontSize={{ base: "sm", md: "lg" }} color="black">{value}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ))}

      {/* Error message */}
      {error && !loading && (
        <Text color="red.500" fontWeight="medium" mt={4}>
          {error}
        </Text>
      )}
      </Box>
    </Box>
  );
}
