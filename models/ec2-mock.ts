import { red, green } from 'colors';

const EC2_INSTANCE_TYPE = "AWS::EC2::Instance";

export class MockEC2 {

  private instanceType?: string
  private monitoring: boolean = false;
  private availabilityZone?: string;

  constructor(private instanceName: string) { }

  withInstanceType(instanceType: string) {
    this.instanceType = instanceType;
  }

  withMonitoring() {
    this.monitoring = true;
  }

  withAvailbilityZone(availbilityZone: string) {
    this.availabilityZone = availbilityZone;
  }


  verify(resources: any): boolean {
    let ec2;
    let isValid = true;

    for (var key in resources) {
      if (resources.hasOwnProperty(key)) {
        var value = resources[key];

        if (value.Type === EC2_INSTANCE_TYPE && value.Properties.FunctionName == this.instanceName) {
          ec2 = value;
        }
      }
    }

    const properties = ec2.Properties;
    require('colors');

    if (this.instanceType && this.instanceType !== properties.InstanceType) {
      console.log(`Error: instanceType '${this.instanceType}' does not match the CDK value`.red);
      isValid = false;
    }

    if (this.monitoring && this.monitoring !== properties.Monitoring) {
      console.log("Error: Monitoring expect to be true but was either false or not found".red)
      isValid = false;
    }

    if (this.availabilityZone && this.availabilityZone !== properties.AvailabilityZone) {
      console.log(`Error: AvailabilityZone '${this.availabilityZone}' does not match the CDK value`.red);
      isValid = false;
    }

    if (isValid) {
      console.log(`Successful verified ${EC2_INSTANCE_TYPE}: '${this.instanceName}'`.green);
    } else {
      console.log('--------'.red);
      console.log(`Failed to validate Lambda: ${this.instanceName}`.red);
      console.log('--------'.red);
    }
    
    return isValid;
  }
}