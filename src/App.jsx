import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Heading,
  FormErrorMessage,
  Text,
  VStack,
  HStack,
  Flex,
  IconButton,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { CopyIcon } from "@chakra-ui/icons"; // Chakra UI's built-in copy icon
import * as Yup from "yup";

const validationSchema = Yup.object({
  originalPrice: Yup.number()
    .positive("Must be a positive number")
    .required("Required"),
  alternativePrice: Yup.number()
    .positive("Must be a positive number")
    .required("Required"),
  bsbOnOrg: Yup.number().min(0, "Must be at least 0").required("Required"),
  bsbOnAlt: Yup.number().min(0, "Must be at least 0").required("Required"),
});

const App = () => {
  const [result, setResult] = useState(null);
  const toast = useToast(); // Toast for feedback

  const handleSubmit = (values, { setSubmitting }) => {
    const { originalPrice, alternativePrice, bsbOnOrg, bsbOnAlt } = values;
    const originalOutOfPocket = originalPrice - bsbOnOrg;
    const alternativeOutOfPocket = alternativePrice - bsbOnAlt;
    const difference = alternativeOutOfPocket - originalOutOfPocket;
    const Invoice = alternativeOutOfPocket - originalPrice;

    setResult({
      guestRefund: difference > 0 ? difference : 0,
      propertyInvoice: Invoice > 0 ? Invoice : 0,
    });

    setSubmitting(false);
  };

  const handleCopy = () => {
    if (result) {
      const resultText = `Guest Refund: ${result.guestRefund.toFixed(
        2
      )}, Property Invoice: ${result.propertyInvoice.toFixed(2)}`;
      navigator.clipboard.writeText(resultText);
      toast({
        title: "Copied!",
        description:
          "The calculation result has been copied to your clipboard.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex minHeight="100vh" align="center" justify="center" bg="white">
      <Box maxW="md" w="full" p={6} boxShadow="lg" borderRadius="md" bg="white">
        <Heading as="h1" mb={6} textAlign="center">
          Relocation Calculator
        </Heading>
        <Formik
          initialValues={{
            originalPrice: "",
            alternativePrice: "",
            bsbOnOrg: 0,
            bsbOnAlt: 0,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <VStack spacing={4}>
                <HStack>
                  <Field name="originalPrice">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.originalPrice &&
                          form.touched.originalPrice
                        }
                      >
                        <FormLabel>Original Cost</FormLabel>
                        <Input
                          {...field}
                          type="number"
                          size="lg"
                          variant="outline"
                          focusBorderColor="blue.500"
                        />
                        <FormErrorMessage>
                          {form.errors.originalPrice}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="bsbOnOrg">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.bsbOnOrg && form.touched.bsbOnOrg
                        }
                      >
                        <FormLabel>BSB</FormLabel>
                        <Input
                          {...field}
                          type="number"
                          size="lg"
                          variant="outline"
                          focusBorderColor="blue.500"
                        />
                        <FormErrorMessage>
                          {form.errors.bsbOnOrg}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </HStack>
                <HStack>
                  <Field name="alternativePrice">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.alternativePrice &&
                          form.touched.alternativePrice
                        }
                      >
                        <FormLabel>Alternative Cost</FormLabel>
                        <Input
                          {...field}
                          type="number"
                          size="lg"
                          variant="outline"
                          focusBorderColor="blue.500"
                        />
                        <FormErrorMessage>
                          {form.errors.alternativePrice}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="bsbOnAlt">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.bsbOnAlt && form.touched.bsbOnAlt
                        }
                      >
                        <FormLabel>BSB</FormLabel>
                        <Input
                          {...field}
                          type="number"
                          size="lg"
                          variant="outline"
                          focusBorderColor="blue.500"
                        />
                        <FormErrorMessage>
                          {form.errors.bsbOnAlt}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </HStack>
                <Button
                  colorScheme="blue"
                  type="submit"
                  isLoading={isSubmitting}
                  mt={4}
                  size="lg"
                  width="full"
                  _hover={{ bg: "blue.600" }}
                >
                  Calculate
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>

        {result && (
          <Box mt={6} p={4} bg="gray.100" borderRadius="md" boxShadow="md">
            <Flex justifyContent="space-between" alignItems="center" mb={2}>
              <Heading as="h3" size="md">
                Calculation Result
              </Heading>
            </Flex>
            <HStack spacing={2}>
              <Text mr={2}>
                <strong>Guest Refund: </strong>
                {result.guestRefund.toFixed(2)}
              </Text>

              <Text mr={2}>
                <strong> Invoice P: </strong>
                {result.propertyInvoice.toFixed(2)}
              </Text>
              <Tooltip label="Copy the result" aria-label="A tooltip">
                <IconButton
                  aria-label="Copy result"
                  icon={<CopyIcon boxSize={4} />}
                  onClick={handleCopy}
                  colorScheme="blue"
                  variant="outline"
                />
              </Tooltip>
            </HStack>
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default App;
