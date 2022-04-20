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

        if (value.Type === POLICY_TYPE && value.Properties.FunctionName == this.policyName) {
          policy = value;
        }
      }
    }

    const properties = policy.Properties;
    require('colors');

    if (this.statements) {
      this.statements.forEach((statement: MockStatement) => {
        let foundMatch = false;
        properties.PolicyDocument.Statements.array.forEach((cdkStatement: any) => {
          if (cdkStatement.Action === statement.actions) {
            foundMatch = true;
            if (statement.effect !== cdkStatement.Effect) {
              console.log(`Error: Effect for actions: '${statement.actions}' did not have expected Effect: '${statement.effect}'`.red);
              isValid = false;
            }
          }
        });

        if (foundMatch === false) {
          console.log(`Error: Could not find expected Statement: '${statement.actions}'`);
          isValid = false;
        }
      });
    }
    
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
    public actions: string[],
    public effect: string
  ) { }

}