import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Stack } from "sst/constructs";

export function getDomainName(stage: string) {
  const MAPPING: Record<string, string> = {
    prod: "ilie-lupu.com",
  };

  const hostedZone = "ilie-lupu.com";
  const domainName = MAPPING[stage] || `${stage}.ilie-lupu.com`;

  return {
    hostedZone,
    domainName,
  };
}

export function getVpc(stack: Stack) {
  const vpc = ec2.Vpc.fromLookup(stack, "VPC", { vpcName: "main-vpc" });
  const privateSubnetSelection = {
    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
  };

  return { vpc, privateSubnetSelection };
}
