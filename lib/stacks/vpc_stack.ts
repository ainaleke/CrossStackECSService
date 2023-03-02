import { Stack, StackProps } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";


export class VpcStack extends Stack {
    public readonly vpc: ec2.IVpc;
    constructor(scope: Construct, id: string, props: StackProps = {}) {
        super(scope, 'VpcStack');

         // create VPC 
         this.vpc = new ec2.Vpc(this, 'Vpc', { 
            maxAzs: 2 
        });
        
    }
}