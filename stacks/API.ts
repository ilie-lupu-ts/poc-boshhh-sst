import * as lambda from "aws-cdk-lib/aws-lambda";
import { StackContext, Api, use } from "sst/constructs";

import { Storage } from "./Storage";
import { getDomainName, getVpc } from "./utils";

export function API({ stack, app }: StackContext) {
  const { vpc, privateSubnetSelection } = getVpc(stack);
  const { domainName, hostedZone } = getDomainName(stack.stage);

  const { reportsBucket } = use(Storage);
  const {
    reportInputTable,
    categorisationsTable,
    parametersTable,
    usersTable,
  } = use(Storage);

  const layerChromium = new lambda.LayerVersion(stack, "chromiumLayers", {
    code: lambda.Code.fromAsset("layers/chromium"),
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        vpc,
        vpcSubnets: privateSubnetSelection,
        bind: [
          reportInputTable,
          reportsBucket,
          categorisationsTable,
          parametersTable,
          usersTable,
        ],
      },
    },
    customDomain: { domainName: `api.${domainName}`, hostedZone },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "POST /pdf": {
        function: {
          handler: "packages/functions/src/pdf.handler",
          layers: [layerChromium],
          timeout: "30 seconds",
          memorySize: "2 GB",
          nodejs: {
            esbuild: {
              external: ["@sparticuz/chromium"],
            },
          },
        },
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.customDomainUrl ?? api.url,
  });

  return { api };
}
