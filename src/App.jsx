import { useState } from "react";
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Heading,
  FormErrorMessage,
  Text,
  Stack,
  Flex,
  Center,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  originalPrice: Yup.number()
    .positive("Must be a positive number")
    .required("Required"),
  alternativePrice: Yup.number()
    .positive("Must be a positive number")
    .required("Required"),
  bsbDiscount: Yup.number().min(0, "Must be at least 0").required("Required"),
});

const App = () => {
  const [result, setResult] = useState(null);

  const handleSubmit = (values, { setSubmitting }) => {
    const { originalPrice, alternativePrice, bsbDiscount } = values;
    const originalOutOfPocket = originalPrice - bsbDiscount;
    const alternativeOutOfPocket = alternativePrice - bsbDiscount;
    const difference = alternativeOutOfPocket - originalOutOfPocket;

    setResult({
      guestRefund: difference > 0 ? difference : 0,
      propertyInvoice: difference > 0 ? alternativePrice : 0,
    });

    setSubmitting(false);
  };

  return (
    <Flex minHeight="100vh" align="center" justify="center" bg="gray.50">
      <Box maxW="md" w="full" p={6} boxShadow="lg" borderRadius="md" bg="white">
        <Heading as="h1" mb={6} textAlign="center">
          Relocation Calculator
        </Heading>
        <Formik
          initialValues={{
            originalPrice: "",
            alternativePrice: "",
            bsbDiscount: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Stack spacing={4}>
                <Field name="originalPrice">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={
                        form.errors.originalPrice && form.touched.originalPrice
                      }
                    >
                      <FormLabel>
                        Original Accommodation Cost (Including Taxes & Fees)
                      </FormLabel>
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

                <Field name="alternativePrice">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={
                        form.errors.alternativePrice &&
                        form.touched.alternativePrice
                      }
                    >
                      <FormLabel>
                        Alternative Accommodation Cost (Including Taxes & Fees)
                      </FormLabel>
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

                <Field name="bsbDiscount">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={
                        form.errors.bsbDiscount && form.touched.bsbDiscount
                      }
                    >
                      <FormLabel>
                        Booking Sponsored Benefit (BSB) Discount
                      </FormLabel>
                      <Input
                        {...field}
                        type="number"
                        size="lg"
                        variant="outline"
                        focusBorderColor="blue.500"
                      />
                      <FormErrorMessage>
                        {form.errors.bsbDiscount}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

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
              </Stack>
            </Form>
          )}
        </Formik>

        {result && (
          <Box mt={6} p={4} bg="gray.100" borderRadius="md" boxShadow="md">
            <Heading as="h3" size="lg" mb={4}>
              Calculation Result
            </Heading>
            <Stack spacing={2}>
              <Text>
                <strong>Guest Refund:</strong> ${result.guestRefund.toFixed(2)}
              </Text>
              <Text>
                <strong>Property Invoice:</strong> $
                {result.propertyInvoice.toFixed(2)}
              </Text>
            </Stack>
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default App;
