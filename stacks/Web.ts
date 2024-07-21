import { NextjsSite, StackContext, use } from "sst/constructs";

import { API } from "./API";
import { getDomainName, getVpc } from "./utils";

export function Web({ stack }: StackContext) {
  const { api } = use(API);
  const { domainName, hostedZone } = getDomainName(stack.stage);
  const { vpc, privateSubnetSelection } = getVpc(stack);

  const web = new NextjsSite(stack, "Site", {
    path: "packages/web",
    customDomain: { domainName, hostedZone },
    environment: {
      NEXT_PUBLIC_API_URL: api.customDomainUrl || api.url,
    },
    cdk: {
      server: {
        vpc,
        vpcSubnets: privateSubnetSelection,
      },
    },
  });

  stack.addOutputs({
    WebUrl: web.customDomainUrl ?? web.url,
  });

  return { web };
}
