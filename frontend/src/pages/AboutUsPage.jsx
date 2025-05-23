import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
const AboutUsPage = () => {
  return (
      <Container maxW="6xl">
        <VStack spacing={10} align="start" >
          
          <Box>
            <Heading as="h2" size="2xl" mb={4}>
              About the Project
            </Heading>
            <Text fontSize="lg">
              Our <strong>Ge’ez Word Derivation</strong> platform is a linguistic and educational tool designed to preserve and promote the Ge’ez language.
              It analyzes the root forms of Ge’ez words and demonstrates how they transform across various grammatical and semantic structures.
              The project aims to serve both language learners and researchers with an intuitive interface and accurate analysis.
            </Text>
          </Box>

        

          Section: Planned Features 
          <Box divideX="2px">
            <Heading as="h2" size="lg" mb={4}>
              Planned Features for Future Versions
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Text fontWeight="bold">1. Voice Input (Speech Recognition)</Text>
                <Text fontSize="md">
                  Users will be able to speak Ge’ez words and receive real-time derivation analysis.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">2. Reverse Derivation</Text>
                <Text fontSize="md">
                  Find all base root words that could lead to a given derived word.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">3. Word Definition Integration</Text>
                <Text fontSize="md">
                  Each derived word will include definitions and usage examples.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">4. Word Formation Explanation</Text>
                <Text fontSize="md">
                  Display detailed steps of how a word is formed grammatically and morphologically.
                </Text>
              </Box>
            </SimpleGrid>
          </Box>

          

        
          <Box divideX="2px">
            <Heading as="h2" size="lg" mb={4}>
              Our Team
            </Heading>
            <Text fontSize="md">
              We are a group of passionate software engineering students from BIT University. With a strong background in linguistics, software development, and UI/UX design, we built this project as part of our final year academic journey to contribute to digital language preservation.
            </Text>
          </Box>
        </VStack>
      </Container>
    
  );
};

export default AboutUsPage; 
