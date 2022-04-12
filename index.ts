import fs from 'fs';
import { MockCode, MockLambda } from './models/lambda-mock';
import { MockS3, RoutingRule as MockRoutingRule, MockWebsiteConfiguration } from './models/s3-mock';

let file = fs.readFileSync('cdk-test.template.json')
let jsonParsed = JSON.parse(file.toString());

const resources = jsonParsed.Resources;

let mockS3 = new MockS3("bengroseclose.com");

mockS3.hasWebsiteConfiguration(new MockWebsiteConfiguration(
  'index.html',
  [
    new MockRoutingRule({ hostName: "bengroseclose.com", replacePrefixWith: "#/" }, { httpErrorReturnCode: "404" }),
    new MockRoutingRule({ hostName: "bengroseclose.com", replacePrefixWith: "#/" }, { httpErrorReturnCode: "403" })
  ]
))

mockS3.hasVersioningConfiguration({ status: "Enabled" })

mockS3.verify(resources);

let mockLambda = new MockLambda(new MockCode(), 'bentest')
  .withTimeout(120)
  .withRuntime('python3.9')
  .withDescription('CDKTest example function')

let environmentVariables: { [key: string]: string } = {};
environmentVariables['BEN_TEST'] = "test env var";
environmentVariables['BEN_TEST_2'] = "super secret password";

mockLambda.withEnvironmentVariables(environmentVariables);

mockLambda.verify(resources);