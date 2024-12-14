#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CognitoPhoneAuthStack } from "../lib/cognito_phone_auth";

const app = new cdk.App();
new CognitoPhoneAuthStack(app, "CognitoPhoneAuthStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
