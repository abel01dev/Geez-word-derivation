// src/components/WordHistory.jsx
import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
  Box,
  Text,
  VStack,
  Spinner,
  Button,
  Heading,
  Divider,
  useColorModeValue
} from "@chakra-ui/react";
import axios from "axios";

const API_URL = "http://localhost:5000";

const WordHistory = forwardRef(({ onSelect }, ref) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    // Don't show loading state for quick refreshes
    const startTime = Date.now();
    try {
      const response = await axios.get(`${API_URL}/api/words`);
      // Only update history if the data is different
      if (JSON.stringify(history) !== JSON.stringify(response.data)) {
        setHistory(response.data);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      // Only show loading state if the request took more than 300ms
      if (Date.now() - startTime > 300) {
        setLoading(false);
      }
    }
  };

  // Expose fetchHistory method through ref
  useImperativeHandle(ref, () => ({
    fetchHistory
  }));

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSelect = (item) => {
    if (onSelect) {
      onSelect({
        word: item.originalWord,
        ruleId: item.pattern.replace("Rule ", "")
      });
    }
  };

  const handlerClear = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`${API_URL}/api/words`);
      if (response.status === 200) {
        setHistory([]);
        // Force a refresh of the history from the server
        await fetchHistory();
      }
    } catch (err) {
      console.error("Error clearing history:", err);
      // Refresh history anyway in case of partial success
      await fetchHistory();
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <Box align="center" p={4}  borderRadius="md" boxShadow="sm" position="relative" bg={useColorModeValue("gray.50", "#383838")}>
      <Heading size="md" mb={4} display="flex" justifyContent="space-between" alignItems="center">
        History
        <Button 
          size="sm" 
          colorScheme="blue" 
          variant="ghost" 
          onClick={handlerClear} 
          isLoading={loading}
          _hover={{ bg: 'blue.50' }}
        >
          Clear History
        </Button>
      </Heading>
      <VStack align="start" spacing={3} maxH="600px" overflowY="auto">
        {history.length === 0 ? (
          <Text color="gray.500">No history yet</Text>
        ) : (
          history.map((item) => (
            <Box key={item._id} w="100%">
              <Button
                variant="ghost"
                size="sm"
                w="100%"
                justifyContent="flex-start"
                onClick={() => handleSelect(item)}
                _hover={{ bg: 'gray.100' }}
              >
                <VStack align="start" spacing={1}>
                  <Text fontWeight="medium" fontSize="xl">{item.originalWord}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {item.pattern} → {item.derivedWord}
                  </Text>
                </VStack>
              </Button>
              <Divider my={2} />
            </Box>
          ))
        )}
      </VStack>
      {loading && (
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
          <Spinner />
        </Box>
      )}
    </Box>
  );
});

export default WordHistory;
