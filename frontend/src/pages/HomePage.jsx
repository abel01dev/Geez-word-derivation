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
  Flex
} from "@chakra-ui/react";
import axios from "axios";
import { MdContactSupport } from "react-icons/md";
import { Link } from "react-router-dom";

export default function DerivationApp() {
  const [inputWord, setInputWord] = useState("");
  const [ruleId, setRuleId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/derive", {
        word: inputWord,
        ruleId,
      });
    setTimeout(() => {
      setResult(response.data);
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
    setResult(null);
    setRuleId(null);
  }

  return (
    <Box w="100%" minH="100vh" p={4} overflowX="hidden">
      <Box w="90%" maxW="1500px" mx="auto" p={4} borderRadius="100px">
      <Box as="form" onSubmit={handleSubmit}  maxW="1500px"
        w="90%"
        mx="auto"
        p={6}
        bg="#F9E3B3"
        borderRadius="xl"
        boxShadow="md"
        position="relative">
          <Box position="absolute" top="10" right="10">
    <Link to="/support">
      <Button
        aria-label="Contact Support"
        borderRadius="3xl"
        colorScheme="teal">
        <MdContactSupport />
      
      </Button>
    </Link>
  </Box>
        <VStack spacing={4} align="stretch">
          {/* Simulating a fieldset using Box */}
          <Box border="1px solid" borderColor="gray.200" p={4} borderRadius="35" bg="#FDDB92">
            <Text textAlign="center" fontSize="2xl" fontWeight="bold" mb={21}>Enter your Root Word And Rule</Text>
              <Box
  w="600px"  // shorter width container
  mx="auto"
  p={4}
  //bg="white"
  borderRadius="md"
  boxShadow="sm"
  bg="gray.300"
  mb={6}
>
  <Flex gap={4} align="center">
    <FormControl isRequired flex="1">
      <FormLabel>Ge'ez Root Word</FormLabel>
      <Input
      textColorcolor=""
        placeholder="Enter Ge'ez root word"
        value={inputWord}
        onChange={(e) => setInputWord(e.target.value)}
      />
    </FormControl>

    <FormControl isRequired flex="1">
      <FormLabel>Rule</FormLabel>
      <Select
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
            <Flex justifyContent="flex-end" mt="auto" gap={4}>
            
              <Button
                type="submit"
                colorScheme="blue"
                position="relative"
               // zIndex="1"
                width="150px"
                isLoading={loading}
                isDisabled={loading}
                loadingText="Generating..."
              >
                {loading ? "Generating..." : "Generate"}
              </Button>
                 <Button
      colorScheme="gray"
      onClick={() => {
        setInputWord("");
        setRuleId("");
        setResult(null);
        setError(null);
      }}
      isDisabled={loading}
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
      {result && !loading && (
        <Box mt={8}  bg="#D57500"
          color="white"
          py={6}
          px={4}
          maxW="1500px"
          w="90%"
          mx="auto"
          borderRadius="xl"
          boxShadow="lg">
          <Text fontSize="lg" fontWeight="semibold" mb={2}>
            Derived Forms
          </Text>
          <Table variant="simple">
            <Thead bg="gray.100">
              <Tr>
                <Th>Form</Th>
                <Th>Derived Word</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(result).map(([form, value]) => (
                <Tr key={form}>
                  <Td>{form}</Td>
                  <Td>{value}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

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
