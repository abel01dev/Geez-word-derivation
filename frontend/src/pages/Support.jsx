// pages/Support.jsx
import {
  Box,
  Collapse,
  IconButton,
  Text,
  VStack,
  useDisclosure,
  useBreakpointValue,
  Link,
} from "@chakra-ui/react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

const Support = () => {
  const { isOpen, onToggle } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      p={{ base: 4, md: 8 }}
      w="100%"
      maxW="100%"
      mx="auto"
      fontFamily="Segoe UI, sans-serif"
      bg="gray.50"
      minHeight="100vh"
    >
      <VStack align="start" spacing={6} width="100%">
        {/* Collapsible Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          cursor="pointer"
          onClick={onToggle}
          p={{ base: 4, md: 6 }}
          border="1px solid #CBD5E0"
          borderRadius="xl"
          bg="white"
          boxShadow="md"
          _hover={{ bg: "gray.100" }}
        >
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            color="gray.800"
          >
            How the Ge'ez Word Derivation Tool Works
          </Text>
          <IconButton
            icon={isOpen ? <MdExpandLess size={isMobile ? 24 : 28} /> : <MdExpandMore size={isMobile ? 24 : 28} />}
            variant="ghost"
            size="lg"
            aria-label="Toggle Support Content"
            color="gray.600"
          />
        </Box>

        {/* Collapsible Content */}
        <Collapse in={isOpen} animateOpacity>
          <Box
            mt={2}
            p={{ base: 4, md: 6 }}
            border="1px solid #E2E8F0"
            borderRadius="xl"
            bg="white"
            boxShadow="base"
            w="100%"
            lineHeight="1.8"
            fontSize={{ base: "md", md: "lg" }}
            color="gray.700"
          >
            <Text mb={4}>
              The <strong>Ge’ez Word Derivation Tool</strong> is a smart linguistic tool
              that helps users generate and study derived forms of Ge’ez root verbs using
              traditional grammar rules.
            </Text>

            <Text fontWeight="semibold" mb={2} color="teal.600">
                      Steps to Derive a Word:
            </Text>

            <VStack align="start" spacing={2} pl={4}>
              <Text>1. Enter a valid <strong>Ge’ez root word</strong> (e.g. <i>ቀተለ</i>).</Text>
              <Text>2. Type the corresponding <strong>Rule ID</strong> (e.g. 1, 2, 3...).</Text>
              <Text>3. Click <strong>“Generate”</strong> to view results.</Text>
              <Text>4. The system processes your input and shows the <strong>derived verb forms</strong>.</Text>
              <Text>5. Your previous search words appear on the <strong>left sidebar</strong>.</Text>
            </VStack>

            <Text mt={4}>
              If you're unsure which rule to choose, try <strong>Rule ID 1</strong> to begin exploring.
            </Text>

            <Text mt={4}>
              💡 Ideal for students, linguists, and researchers — this tool bridges tradition with technology.
            </Text>

            <Text mt={4}>
              🔐 Your searches are temporarily saved locally in your browser for quick reference.
            </Text>

            {/* Email Support */}
            <Text mt={6} fontWeight="medium">
              📩 For more support, feel free{" "}
              <Link
                href="mailto:natnaelfk@gmail.com"
                color="teal.500"
                fontWeight="bold"
                textDecoration="underline"
              >
to email us              </Link>
              .
            </Text>
          </Box>
        </Collapse>

        {/* Sign Up and Login Instructions */}
        <Box p={4} bg="white" borderRadius="lg" border="1px solid #E2E8F0" w="100%">
          <Text fontSize="xl" fontWeight="bold" mb={2}>How to Sign Up and Log In</Text>
          <Text as="ol" pl={4} style={{ listStyleType: 'decimal' }}>
            <li>On the login page, click <b>Sign Up</b> and enter your full name, email, and password.</li>
            <li>Click the <b>Sign Up</b> button. After successful registration, you will be redirected to the login page.</li>
            <li>Enter your registered email and password on the login page and click the <b>Login</b> button.</li>
            <li> After successful login, you will access the Geez Word Derivation feature.</li>
         <li>if you finish these step Read <b>How the geez derivation tool work</b></li>
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default Support;
