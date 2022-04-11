import fs from 'fs';
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