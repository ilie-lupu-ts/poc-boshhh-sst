import { SSTConfig } from "sst";
import { API } from "./stacks/API";
import { Web } from "./stacks/Web";
import { Storage } from "./stacks/Storage";

export default {
  config(_input) {
    return {
      name: "poc-boshhh-sst",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.stack(Storage);
    app.stack(API);
    app.stack(Web);
  },
} satisfies SSTConfig;
