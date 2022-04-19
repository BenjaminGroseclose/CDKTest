import { red, green } from 'colors';

const LAMBDA_TYPE = "AWS::Lambda::Function";

export class MockLambda {

  private runtime?: string;
  private memory?: number;
  private timeout?: number;
  private desc?: string;
  private envVar?: { [key: string]: string };

  constructor(
    private codeType: CodeType,
    private name: string,
  ) { }

  withRuntime(runtime: string): MockLambda {
    this.runtime = runtime;
    return this;
  }

  withMemory(memory: number): MockLambda {
    this.memory = memory;
    return this;
  }

  withTimeout(timeout: number): MockLambda {
    this.timeout = timeout;
    return this;
  }

  withDescription(desc: string): MockLambda {
    this.desc = desc
    return this;
  }

  withEnvironmentVariables(envVar: { [key: string]: string }): MockLambda {
    this.envVar = envVar;
    return this;
  }

  private verifyCodeType(properties: any): boolean {
    let isValid = true;

    switch (this.codeType) {
      case CodeType.S3:
        if (properties.Code.S3Bucket && properties.Code.S3Bucket === "") {
          console.log(`Error: Expected CodeType: 'S3' but could not find any S3Bucket property`.red);
          isValid = false;
        }
        break;
      case CodeType.IMAGE_URI:
        if (properties.Code.ImageUri && properties.Code.ImageUri === "") {
          console.log(`Error: Expected CodeType: 'IMAGE_URI' but could not find any ImageUri property`.red);
          isValid = false;
        }
        break;
      case CodeType.ZIP_FILE:
        if (properties.Code.ZipFile && properties.Code.ZipFile === "") {
          console.log(`Error: Expected CodeType: 'ZIP_FILE' but could not find any ZipFile property`.red);
          isValid = false;
        }
        break;
    }

    return isValid;
  }

  verify(resources: any): boolean {
    let lambda;
    let isValid = true;

    for (var key in resources) {
      if (resources.hasOwnProperty(key)) {
        var value = resources[key];

        if (value.Type === LAMBDA_TYPE && value.Properties.FunctionName == this.name) {
          lambda = value;
        }
      }
    }

    const properties = lambda.Properties;
    require('colors');

    if (this.name && this.name !== properties.FunctionName) {
      console.log(`Error: FunctionName '${this.name}' does not match the CDK value`.red);
      isValid = false;
    }

    if (this.runtime && this.runtime !== properties.Runtime) {
      console.log(`Error: Runtime: '${this.runtime}' does not match the cdk value`.red);
      isValid = false;
    }

    if (this.memory && this.memory !== properties.MemorySize) {
      console.log(`Error: MemorySize '${this.memory}' does not matc CDK value`.red);
      isValid = false;
    }

    if (this.timeout && this.timeout !== properties.Timeout) {
      console.log(`Error: Timeout '${this.timeout}' does not matc CDK value`.red);
      isValid = false;
    }

    if (this.desc && this.desc !== properties.Description) {
      console.log(`Error: Description '${this.desc}' does not match CDK value`.red)
      isValid = false;
    }

    if (this.envVar) {
      let failed = false;
      for (let key in this.envVar) {
        if (this.envVar[key] !== properties.Environment.Variables[key]) {
          console.log(`Error: Envionment Variable: ${key} does not match or can not be found`.red)
          failed = true;
        }
      }

      if (failed) {
        isValid = false;
      }
    }

    isValid = this.verifyCodeType(properties);

    if (isValid) {
      console.log(`Successful verified ${LAMBDA_TYPE}: '${this.name}'`.green);
    } else {
      console.log('--------'.red);
      console.log(`Failed to validate Lambda: ${this.name}`.red);
      console.log('--------'.red);
    }

    return isValid;
  }

};

export enum CodeType {
  S3,
  ZIP_FILE,
  IMAGE_URI
}