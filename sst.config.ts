import { SSTConfig } from "sst";
import { API } from "./stacks/MainStack";

export default {
  config(_input) {
    return {
      name: "poc-boshhh-sst",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.stack(API);
  },
} satisfies SSTConfig;
