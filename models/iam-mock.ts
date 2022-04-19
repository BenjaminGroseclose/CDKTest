import { red, green } from 'colors';

const POLICY_TYPE = "AWS::IAM::Policy";

export class MockPolicy {

  private statements?: MockStatement[];

  constructor(private policyName: string) {  }

  addPolicyStatement(statement: MockStatement) {
    this.statements?.push(statement);
  }

  verify(resources: any): boolean {
    let policy;
    let isValid = true;

    for (var key in resources) {
      if (resources.hasOwnProperty(key)) {
        var value = resources[key];

        if (value.Type === POLICY_TYPE && value.Properties.FunctionName == this.queueName) {
          policy = value;
        }
      }
    }

    // TODO: Validate Statements
    // for (var statement in this.statements)
    // {
    //   if ()
    // }
    
    if (isValid) {
      console.log(`Successful verified ${POLICY_TYPE}: '${this.policyName}'`.green);
    } else {
      console.log('--------'.red);
      console.log(`Failed to validate IAM Policy: ${this.policyName}`.red);
      console.log('--------'.red);
    }

    return isValid;
  }
}

export class MockStatement {

  constructor(
    private actions: string[],
    private effect: string
  ) { }

}