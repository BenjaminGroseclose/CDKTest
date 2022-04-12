import { red, green } from 'colors';

const LAMBDA_TYPE = "AWS::Lambda::Function";

export class MockLambda {

  private runtime?: string;
  private memory?: number;
  private timeout?: number;
  private desc?: string;
  private envVar?: { [key: string]: string };

  constructor(
    private code: MockCode,
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

  verify(resources: any): boolean {
    let lambda;

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
      return false;
    }

    if (this.runtime && this.runtime !== properties.Runtime) {
      console.log(`Error: Runtime: '${this.runtime}' does not match the cdk value`.red);
      return false;
    }

    if (this.memory && this.memory !== properties.MemorySize) {
      console.log(`Error: MemorySize '${this.memory}' does not matc CDK value`.red);
      return false;
    }

    if (this.timeout && this.timeout !== properties.Timeout) {
      console.log(`Error: Timeout '${this.timeout}' does not matc CDK value`.red);
      return false;
    }

    if (this.desc && this.desc !== properties.Description) {
      console.log(`Error: Description '${this.desc}' does not match CDK value`.red)
      return false;
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
        return false;
      }
    }

    console.log(`Successful verified ${LAMBDA_TYPE}: '${this.name}'`.green);
    return true;
  }

};

export class MockCode {

  imageUri?: string
  s3Bucket?: string
  s3Key?: string
  s3ObjectVersion?: string
  zipFile?: string

  constructor(
    imageUri?: string,
    s3Bucket?: string,
    s3Key?: string,
    s3ObjectVersion?: string,
    zipFile?: string
  ) {
    this.imageUri = imageUri;
    this.s3Bucket = s3Bucket;
    this.s3Key = s3Key;
    this.s3ObjectVersion = s3ObjectVersion;
    this.zipFile = zipFile;
  }

}