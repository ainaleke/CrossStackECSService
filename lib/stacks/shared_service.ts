import { Stack, StackProps } from "aws-cdk-lib";
import * as ecs from "aws-cdk-lib/aws-ecs"
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from "constructs";
import { EcsConstruct } from "../constructs/ecs_constructs";

export interface SharedServiceStackProps extends StackProps {
    vpc: ec2.IVpc;
}

export class SharedServiceStack extends Stack {
   
    public readonly cluster: ecs.Cluster;

    constructor(scope: Construct, id: string, props : SharedServiceStackProps) {
        super(scope, id, props);

       
        // create and initialize ecs Cluster.
        this.cluster = new ecs.Cluster(this, 'EcsCluster', {
          vpc: props.vpc
        });

        
        const ecsConstruct = new EcsConstruct(this, 'ECSConstSharedServiceStack', {
            vpc: props.vpc,
            cluster: this.cluster,
        });
    }
}