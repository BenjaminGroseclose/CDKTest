import { red, green } from 'colors';

const LAMBDA_TYPE = "AWS::Lambda::Function";

export class MockLambda {

  code: MockCode;
  runtime?: string;
  name?: string;
  memory?: number;

  constructor(
    code: MockCode,
    name: string,
    runtime?: string,
    memory?: number
  ) {
    this.code = code;
    this.name = name;
    this.runtime = runtime;
    this.memory = memory;
  }

  verify(resources: any): boolean {
    let lambda;

    for (var key in resources) {
      if (resources.hasOwnProperty(key)) {
        var value = resources[key];

        if (value.Type === LAMBDA_TYPE) {
          lambda = value;
        }
      }
    }

    const properties = lambda.Properties;
    require('colors');

    // TODO Code:


    if (this.name && this.name !== properties.FunctionName) {
      console.log(`Error: FunctionName '${this.name}' does not match the CDK value`.red);
      return false;
    }

    if (this.runtime && this.runtime !== properties.RunTime) {
      console.log(`Error: Runtime: '${this.runtime}' does not match the cdk value`.red);
      return false;
    }

    if (this.memory && this.memory !== properties.MemorySize) {
      console.log(`Error: MemorySize '${this.memory}' does not matc CDK value`.red);
    }

    if (this.name) {
      console.log(`Successful verified Lambda: ${this.name}.`.green);
    } else {
      console.log(`Successful verified Lambda`.green);
    }
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