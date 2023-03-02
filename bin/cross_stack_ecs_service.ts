#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CrossStackEcsServiceStack } from '../lib/cross_stack_ecs_service-stack';
import { SharedServiceStack } from '../lib/stacks/shared_service';
import { VpcStack } from '../lib/stacks/vpc_stack';

const app = new cdk.App();

//since Vpc Creation takes time, we would only need to do this once.
const vpcStack = new VpcStack(app, 'VpcStack');


//initialize and pass in vpcStack to the sharedInfra Stack to keep Vpc stack separate
const sharedInfra = new SharedServiceStack(app, 'SharedInfraStack', {
    vpc: vpcStack.vpc
});


new CrossStackEcsServiceStack(app, 'CrossStackEcsServiceStack', {
    /* If you don't specify 'env', this stack will be environment-agnostic.
    * Account/Region-dependent features and context lookups will not work,
    * but a single synthesized template can be deployed anywhere. */

    /* Uncomment the next line to specialize this stack for the AWS Account
    * and Region that are implied by the current CLI configuration. */
    // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

    /* Uncomment the next line if you know exactly what Account and Region you
    * want to deploy the stack to. */
    // env: { account: '123456789012', region: 'us-east-1' },

    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */

   
});