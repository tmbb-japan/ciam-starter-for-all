// Import AWS CDK libraries
import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class CognitoPhoneAuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a Cognito User Pool
    const userPool = new cognito.UserPool(this, "UserPool", {
      userPoolName: "PhoneAuthUserPool",
      selfSignUpEnabled: true, // Allow users to sign up
      signInAliases: {
        phone: true, // Enable phone number as a sign-in option
      },
      autoVerify: {
        phone: true, // Automatically verify phone numbers
      },
      mfa: cognito.Mfa.REQUIRED, // Require MFA
      mfaSecondFactor: {
        sms: true, // Enable SMS-based MFA
        otp: false, // Disable TOTP (time-based one-time password)
      },
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.PHONE_ONLY, // Account recovery via phone only
    });

    // Add an SMS Role for Cognito to send SMS messages
    const smsRole = new cognito.CfnUserPoolRoleAttachment(this, "SMSRole", {
      roleArn: "arn:aws:iam::your-account-id:role/service-role/CognitoSMSRole",
      userPoolId: userPool.userPoolId,
    });

    // Create a User Pool Client
    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      generateSecret: false, // No client secret needed for public-facing apps
      authFlows: {
        userPassword: true, // Enable username-password authentication
        custom: true, // Allow custom auth flows if needed
      },
    });

    // Output the User Pool ID and Client ID
    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });
  }
}
