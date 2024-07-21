import { Bucket, StackContext, Table } from "sst/constructs";

export function Storage({ stack }: StackContext) {
  // S3 Buckets
  const reportsBucket = new Bucket(stack, "Reports", {});

  // DynamoDB Tables
  const reportInputTable = new Table(stack, "ReportInput", {
    primaryIndex: { partitionKey: "PK" },
    fields: {
      PK: "string",
    },
  });
  const categorisationsTable = new Table(stack, "Categorisations", {
    fields: {
      PK: "string",
      SK: "string",
    },
    primaryIndex: { partitionKey: "PK", sortKey: "SK" },
    globalIndexes: {
      "SK-index": {
        partitionKey: "SK",
      },
    },
  });
  const parametersTable = new Table(stack, "Parameters", {
    primaryIndex: { partitionKey: "id" },
    fields: {
      id: "string",
    },
  });

  const usersTable = new Table(stack, "Users", {
    fields: {
      email: "string",
    },
    primaryIndex: { partitionKey: "email" },
  });

  stack.addOutputs({
    ReportsBucketName: reportsBucket.bucketName,
    ReportInputTableName: reportInputTable.tableName,
    CategorisationsTableName: categorisationsTable.tableName,
    ParametersTableName: parametersTable.tableName,
    UsersTableName: usersTable.tableName,
  });

  return {
    reportsBucket,
    reportInputTable,
    categorisationsTable,
    parametersTable,
    usersTable,
  };
}
