import React, { useState, useRef } from "react";
import "./animations.css";
import { Box, Button, FormControl, FormLabel, Input, Select, Text, Table, Thead, Tbody, Tr,Th, Td, VStack, Flex, useColorModeValue
} from "@chakra-ui/react";
import axios from "axios";
import { MdContactSupport } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaFileDownload } from "react-icons/fa";
import WordHistory from "../components/WordHistory";
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
const API_URL = 'http://192.168.100.43:5000';

export default function DerivationApp() {
  const [inputWord, setInputWord] = useState("");
  const [ruleId, setRuleId] = useState("");
  const [result, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const historyRef = useRef();

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
          setResults(prev => [response.data, ...prev]);
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
    setResults([]);
    setRuleId("");
  }
  const handleHistoryClick = async (item) => {
    // Set the input values
    setInputWord(item.word);
    setRuleId(item.ruleId);

    // Find existing result
    const existingResultIndex = result.findIndex(r => 
      r.pastTense === item.derivedWord || 
      Object.values(r).some(value => value === item.derivedWord)
    );

    if (existingResultIndex !== -1) {
      // If result exists, move it to the top
      const existingResult = result[existingResultIndex];
      setResults(prev => [
        existingResult,
        ...prev.slice(0, existingResultIndex),
        ...prev.slice(existingResultIndex + 1)
      ]);
    } else {
      // Only if we don't have the result, make a new request
      handleSubmit(new Event('submit'));
    }
  };

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
        gap={6}
        direction={{ base: "column", lg: "row" }}
      >
        {/* Main content */}
        <Box flex="3" marginLeft="300px">
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
                    borderRadius="md"
                    boxShadow="sm"
                        bg={{ base: "gray.00", md: "gray.0" }}
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
             color={resultcolor}
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
          ))}

          {/* Error message */}
          {error && !loading && (
            <Text color="red.500" fontWeight="medium" mt={4}>
              {error}
            </Text>
          )}
        </Box>

        {/* Word History Sidebar */}
        <Box 
        position="fixed"  // instead of "sticky"
  left="0"         // stick to left edge
 top="235px"        // adjust this value based on your navbar height
  bottom="60px"  
  width="350px"    // fixed width
  overflowY="auto" // for scrolling
  borderRight="1px solid" // optional border
  borderColor="gray.200"
    display={{ base: "none", lg: "block" }}
        >
          <WordHistory ref={historyRef} onSelect={handleHistoryClick} />
        </Box>
      </Flex>
    </Box>
  );
}
