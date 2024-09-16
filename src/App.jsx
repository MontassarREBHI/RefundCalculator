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
    <Flex
      justifyContent="space-between"
      minHeight="80vh"
      alignItems="center"
      mt={6}
      p={4}
    >
      <Box w="30%" bg="green.100" p={4} borderRadius="md" boxShadow="md">
        <Text fontSize="lg" fontWeight="bold">
          Tips on the side:
        </Text>

        <Text fontSize="md" mt={12}>
          Make sure the prices you're entering are in the same currency : "that
          of the original"
        </Text>

        <Text fontSize="md" mt={12} mb={8}>
          Ensure any excluded taxes/fees are accounted on both sides
        </Text>
      </Box>

      <Box w="35%" bg="white" p={4} borderRadius="md" boxShadow="xl">
        <Heading as="h3" size="lg" textAlign="center" mb={6}>
          Relocation Cost Calculator
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
                <HStack align="start">
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
                          step="any"
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
                          step="any"
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
                <HStack align="start">
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
                          step="any"
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
                          step="any"
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
            <Flex w="full" justifyContent="space-between" alignItems="center">
              <Text>
                <strong>Guest Refund: </strong>
                {result.guestRefund.toFixed(2)}
              </Text>

              <Text>
                <strong>Invoice P: </strong>
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
            </Flex>
          </Box>
        )}
      </Box>

      <Box w="30%" bg="green.100" p={4} borderRadius="md" boxShadow="md">
        <Text fontSize="lg" fontWeight="bold">
          Tips on the other side:
        </Text>
        <Text fontSize="md" mt={12}>
          Other eligible to refund costs can be included in the alternative cost
          : such as taxi or parking
        </Text>

        <Text fontSize="md" mt={12} mb={8}>
          Always refer to official resources or seek support in cases of doubt
        </Text>
      </Box>
    </Flex>
  );
};

export default App;
