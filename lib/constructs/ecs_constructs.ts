import { CfnOutput, Duration, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs"
import * as ec2 from "aws-cdk-lib/aws-ec2"
import { ICluster } from "aws-cdk-lib/aws-ecs";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";

export interface EcsConstructProps extends StackProps {
    vpc: ec2.IVpc;
    cluster: ICluster;
}

export class EcsConstruct extends Construct {
    constructor(scope: Construct, id: string, props: EcsConstructProps) {
        super(scope, id);

        const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef');

        // add cloudWatch logs
        const logging = new ecs.AwsLogDriver({
            streamPrefix: "ecsSample",
            mode: ecs.AwsLogDriverMode.NON_BLOCKING
        });

        const container = taskDefinition.addContainer('webContainer', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 256,
            // The containerName overrides the Id 'webContainer' if present
            containerName: 'BusyLekeBox', 
            logging
        });

        container.addPortMappings({
            containerPort: 80,
            protocol: ecs.Protocol.TCP
        });
        
        // create ecs service
        const service = new ecs.FargateService(this, "EcsService", {
            cluster: props.cluster,
            taskDefinition: taskDefinition
        });

        const loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'AppLoadBalancer', {
            vpc: props.vpc,
            internetFacing: true
        });

        // create a listener in the current scope, add targets to it
        const listener = new elbv2.ApplicationListener(this, 'ALBListener', {
            loadBalancer: loadBalancer,
            port: 80,
        });

        // Attach LB to ECS Fargate Service.
        listener.addTargets('ECS', {
            port: 80,
            targets: [service],
            // health check
            healthCheck: {
                interval: Duration.seconds(60),
                path: "/health",
                timeout: Duration.seconds(5)
            }
          });

        // Assign Loabalancer a name
        new CfnOutput(this, 'LoadBalancerDNS', {
            value: loadBalancer.loadBalancerDnsName
        });
    }
}