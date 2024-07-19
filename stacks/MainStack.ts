import { StackContext, Api, NextjsSite } from "sst/constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as lambda from "aws-cdk-lib/aws-lambda";

export function API({ stack }: StackContext) {
  const hostedZone = "ilie-lupu.com";
  const customDomains = getCustomDomains(stack.stage, hostedZone);

  const vpc = ec2.Vpc.fromLookup(stack, "VPC", { vpcName: "main-vpc" });
  const vpcPrivateSubnets = { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS };

  const layerChromium = new lambda.LayerVersion(stack, "chromiumLayers", {
    code: lambda.Code.fromAsset("layers/chromium"),
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        vpc,
        vpcSubnets: vpcPrivateSubnets,
      },
    },
    customDomain: customDomains?.api,
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

  const web = new NextjsSite(stack, "Site", {
    path: "packages/web",
    customDomain: customDomains?.web,
    environment: {
      NEXT_PUBLIC_API_URL: api.url,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    WebUrl: web.url,
  });
}

function getCustomDomains(stage: string, hostedZone: string) {
  const stages = ["prod", "dev"];
  if (!stages.includes(stage)) {
    return;
  }

  return {
    api: stage === "prod" ? `api.${hostedZone}` : `api.${stage}.${hostedZone}`,
    web: stage === "prod" ? hostedZone : `${stage}.${hostedZone}`,
  };
}
