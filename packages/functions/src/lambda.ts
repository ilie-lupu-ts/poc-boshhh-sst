import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      error,
    };
  }
});
