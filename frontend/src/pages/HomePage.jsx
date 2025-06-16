import React, { useState, useRef } from "react";
import "./animations.css";
import { Box, Button, FormControl, FormLabel, Input, Select, Text, Table, Thead, Tbody, Tr,Th, Td, VStack, Flex, useColorModeValue
} from "@chakra-ui/react";
import axios from "axios";
import { MdContactSupport } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaFileDownload } from "react-icons/fa";
import WordHistory from "../components/WordHistory";
import { Repeat, Trash2 } from "lucide-react"; // from lucide-react icon set

const formLabels = {
    pastTense: "ኀላፊ አንቀጽ",
    futureTense: "ትንቢት አንቀጽ",
    infinitivePurposeConstruction: "ዘንድ አንቀጽ",
    jussive: "ትእዛዝ አንቀጽ",
    infinitiveOrGerundA: "አርእስት(ሀ)",
    infinitiveOrGerundB: "አርእስት(ለ)",
    converb: "ቦዝ አንቀጽ",
    descriptiveNounSingleMen: "ሳልስ ውስተ ዘ ወንድ",
    descriptiveNounPluralMen: "ሳልስ ውስተ ዘ ወንድ ለብዙ",
    descriptiveNounSingleWoman: " ሳልስ ወስተ ዘ ሴት",
    descriptiveNounPluralWoman: "ሳልስ ውስተ ዘ ሴት ለብዙ",
    nominalAdjectiveSingleMen: "ሳድስ ውስተ ዘ ወንድ",
    nominalAdjectivePluralMen: "ሳድስ ውስተ ዘ ወንድ ብዙ",
    nominalAdjectiveSingleWoman: "ሳድስ ውስተ ዘ ሴት",
    nominalAdjectivePluralWoman: "ሳድስ ውስተ ዘ ሴት ብዙ",
};
const API_URL = 'http://localhost:5000';

export default function DerivationApp() {
  const [inputWord, setInputWord] = useState("");
  const [ruleId, setRuleId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const historyRef = useRef();
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/derive`, {
        word: inputWord,
        ruleId,
      });

      setTimeout(() => {
        if (response.data) {
          setResult(response.data);
          setError(null);
          // Refresh history after successful derivation
          historyRef.current?.fetchHistory();
        } else {
          setError("No result returned from server");
        }
        setLoading(false);
      }, 2500);
    } catch (err) {
      setTimeout(() => {
        console.error("Error details:", err);
        setError(err.response?.data?.error || "An error occurred while processing your request");
        setLoading(false);
      }, 2500);
    }
  };
  const handlerClear = () => {
    setInputWord("");
    setError("");
    setResult(null);
    setRuleId("");
  }
const handleHistoryClick = async (item) => {
    setInputWord(item.word);
    setRuleId(item.ruleId);
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/derive`, {
        word: item.word,
        ruleId: item.ruleId,
      });

      setTimeout(() => {
        setResult(response.data);
        setLoading(false);
      }, 2500);
    } catch (historyError) {
    setTimeout(() => {
      console.error("History error:", historyError);
      setError("Failed to regenerate from history.");
      setLoading(false);
    }, 2500);
    }
  };
   // ---- Download as .txt ----
 const downloadAsTxt = () => {
    let content = "";

    Object.entries(result).forEach(([form, word]) => {
      content += `${formLabels[form] || form}: ${word}\n`;
    });

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "derived_words.txt";
  link.click();
  URL.revokeObjectURL(url);
};

const resultBg = useColorModeValue("white.5000", "242322") ;
const resultcolor=  useColorModeValue("gray.800", "#FFFFFF")
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
      <Flex
        w="100%"
        maxW="1400px"
        mx="auto"
        gap={20}
        direction={{ base: "column", lg: "row" }}
      >
        {/* Main content */}
        <Box flex="10">
          <Box as="form" onSubmit={handleSubmit}  maxW="1200px"
            w="100%"
            mx="auto"
            px={{ base: 4, md: 4 }} // more breathing room on mobile
             py={{ base: 4, md: 4 }}      
            borderRadius="xl"
            boxShadow="md"
            position="relative">
               <Button
          display={{ base: "block", lg: "none" }}
          position="fixed"
          bottom="20px"
          right="20px"
          zIndex="1000"
          colorScheme="blue"
          borderRadius="full"
          boxShadow="lg"
          onClick={() => setIsHistoryVisible(!isHistoryVisible)}
        >
          {isHistoryVisible ? "Hide H.." : "Show H.."}
        </Button>
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
                    borderRadius="2xl"
                    boxShadow="0 6px 26px rgba(0, 0, 0, 0.1)"
                     bg={useColorModeValue("gray.50", "gray.800")}
                       mb={{ base: 4, md: 6 }}
                    >
                        <Flex
                          w="100%"
                           wrap={{ base: "wrap", md: "nowrap" }}
                            direction={{ base: "column", md: "row" }}
                              gap={4}
                               align="center"
                                 justify="center"
                                    mb={4}
                                   >  
                          <FormControl isRequired flex="1">
                 <FormLabel fontSize={{ base: "sm", md: "md" }}>Ge'ez Root Word</FormLabel>
             <Input
                    size={{ base: "sm", md: "md" }}
                       bg="white"
                         color="black"
                           border="1px solid"
                              borderColor="orange.300"
           _hover={{ borderColor: "orange.400" }}
           _focus={{ borderColor: "orange.500", boxShadow: "0 0 0 1px orange" }}
          borderRadius="2xl"
           placeholder="Enter Ge'ez root word"
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
         />
    </FormControl>
    <FormControl isRequired flex="1">
      <FormLabel fontSize={{ base: "sm", md: "md" }}>Rule</FormLabel>
      <Select
          size={{ base: "sm", md: "md" }}
        bg="white"
        color="black"
        border="1px solid"
        borderColor="orange.300"
        borderRadius="2xl"
        
         _hover={{ borderColor: "orange.400" }}
        _focus={{ borderColor: "orange.500", boxShadow: "0 0 0 1px orange" }}
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
               <Flex
  justifyContent="center"
  alignItems="center"
  mt={{ base: -2, md: -1 }}
  mb={{ base: 6, md: 8 }}
  gap={3}
  direction={{ base: "column", md: "row" }}
>
  <Button
    type="submit"
    leftIcon={<Repeat size={18} />}
    size={{ base: "sm", md: "md" }}
    minW={{ base: "100%", md: "140px" }}
    isLoading={loading}
    isDisabled={loading}
    loadingText="Generating..."
    fontWeight="semibold"
    bgGradient="linear(to-r, orange.400, orange.600)"
    color="white"
    _hover={{ bgGradient: "linear(to-r, orange.500, orange.700)", transform: "scale(1.03)" }}
    _active={{ transform: "scale(0.97)" }}
    _dark={{
      bgGradient: "linear(to-r, orange.300, orange.500)",
      _hover: { bgGradient: "linear(to-r, orange.400, orange.600)" }
    }}
    transition="all 0.2s"
    borderRadius="xl"
    shadow="md"
  >
    {loading ? "Generating..." : "Generate"}
  </Button>

  <Button
    leftIcon={<Trash2 size={18} />}
    onClick={handlerClear}
    isDisabled={loading}
    size={{ base: "sm", md: "md" }}
    minW={{ base: "100%", md: "140px" }}
    fontWeight="semibold"
    bg="red.500"
    color="white"
    _hover={{ bg: "red.600", transform: "scale(1.03)" }}
    _active={{ transform: "scale(0.97)" }}
    _dark={{
      bg: "red.400",
      _hover: { bg: "red.500" },
      color: "white"
    }}
    transition="all 0.2s"
    borderRadius="xl"
    shadow="md"
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
            <Box mt={8}  bg={resultBg}
             color={resultcolor}
              py={6}
              px={4}
              maxW="1500px"
              w="90%"
              mx="auto"
              borderRadius="xl"
              boxShadow="lg">
             
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
                            fontSize={{ base: "sm", md: "md" }}
                     >
                 Form
                     </Th>
                     <Th 
                   bgGradient="linear(to-l, orange.300, yellow.200)"
                      color="gray.800"
                        fontWeight="bold"
        fontSize={{ base: "sm", md: "md" }}
      >
        Derived Word
      </Th>
    </Tr>
  </Thead>

              <Tbody>
                {Object.entries(result).map(([form, value]) => (
                  <Tr key={form}>
  <Td fontSize={{ base: "sm", md: "sm" }} color={formTextColor}>
  {formLabels[form] || form}  </Td>
                    <Td fontSize={{ base: "sm", md: "xl" }} >{value}</Td>
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

        {/* Word History Sidebar */}
        <Box 
          as="aside"
      //order={-3}
      //flex="1"
      display={{ base: isHistoryVisible ? "block" : "none", lg: "block" }}
  position={{ base: "fixed", lg: "absolute" }}
      top="248px"
      bottom=""
      left="0"
      //h="50%"
      transform={{ base: "translate(-50%, -50%)", lg: "none" }}
      w={{ base: "90%", lg: "320px" }}
      h={{ base: "80vh", lg: "auto" }}
      zIndex="999"
    
      borderRight="1px solid"
      boxShadow="md"
    >
          <WordHistory ref={historyRef} onSelect={handleHistoryClick} />
        </Box>
      </Flex>
    </Box>
  );
}
