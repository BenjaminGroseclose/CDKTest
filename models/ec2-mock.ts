import { red, green } from 'colors';

const EC2_TYPE = "AWS::EC2::Instance";

export class MockEC2 {
  constructor(private instanceName: string) { }

  verify(resources: any): boolean {
    let ec2;

    for (var key in resources) {
      if (resources.hasOwnProperty(key)) {
        var value = resources[key];

        if (value.Type === EC2_TYPE && value.Properties.FunctionName == this.instanceName) {
          ec2 = value;
        }
      }
    }



    console.log(`Successful verified ${EC2_TYPE}: '${this.instanceName}'`.green);
    return true;
  }
}