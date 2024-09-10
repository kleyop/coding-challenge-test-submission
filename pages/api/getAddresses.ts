import type { NextApiRequest, NextApiResponse } from "next";
import generateMockAddresses from "../../src/utils/generateMockAddresses";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { postcode, streetnumber },
  } = req;

  // Validation: Postcode and streetnumber must be provided
  if (!postcode || !streetnumber) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode and street number fields mandatory!",
    });
  }

  // Validation: Postcode must be at least 4 digits
  if ((postcode as string).length < 4) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode must be at least 4 digits!",
    });
  }

  // Reusable validation function for numeric checks
  const isStrictlyNumeric = (value: string) => {
    return /^\d+$/.test(value); // This checks if the string contains only digits
  };

  // Validation: Postcode must be all digits and non-negative
  if (!isStrictlyNumeric(postcode as string)) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode must be all digits and non negative!",
    });
  }

  // Validation: Street Number must be all digits and non-negative
  if (!isStrictlyNumeric(streetnumber as string)) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Street Number must be all digits and non negative!",
    });
  }

  // Generate mock addresses
  const mockAddresses = generateMockAddresses(
    postcode as string,
    streetnumber as string
  );

  if (mockAddresses) {
    const timeout = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    // Simulate a delay for loading status check
    await timeout(500);

    return res.status(200).json({
      status: "ok",
      details: mockAddresses,
    });
  }

  // No results found
  return res.status(404).json({
    status: "error",
    // DO NOT MODIFY MSG - used for grading
    errormessage: "No results found!",
  });
}
