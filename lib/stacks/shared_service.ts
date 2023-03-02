import { Stack, StackProps } from "aws-cdk-lib";
import * as ecs from "aws-cdk-lib/aws-ecs"
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from "constructs";
import { EcsConstruct } from "../constructs/ecs_constructs";


export class SharedServiceStack extends Stack {
    public readonly vpc: ec2.Vpc;
    public readonly cluster: ecs.Cluster;

    constructor(scope: Construct, id: string, props : StackProps = {}) {
        super(scope, id, props);

        this.vpc = new ec2.Vpc(this, 'Vpc', { 
            maxAzs: 2 
        });
        this.cluster = new ecs.Cluster(this, 'EcsCluster', {
          vpc: this.vpc
        });

        
        const ecsConstruct = new EcsConstruct(this, 'ECSConstSharedServiceStack', {
            vpc: this.vpc,
            cluster: this.cluster,
        });
    }
}