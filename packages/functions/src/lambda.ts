import { ApiHandler } from "sst/node/api";
import { Bucket } from "sst/node/bucket";
import { Table } from "sst/node/table";

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
