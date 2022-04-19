import { red, green } from 'colors'

const S3_TYPE = "AWS::S3::Bucket";
const S3_BUCKET_TYPE = "AWS::S3::BucketPolicy";

export class MockS3 {

  bucketName: string;
  websiteConfiguration?: MockWebsiteConfiguration;
  versionConfiguration?: { status: string };
  bucketPolicy?: any;

  constructor(bucketName: string) {
    this.bucketName = bucketName
  }

  hasWebsiteConfiguration(websiteConfiguration: MockWebsiteConfiguration) {
    this.websiteConfiguration = websiteConfiguration;
  }

  hasVersioningConfiguration(versionConfiguration: { status: string }) {
    this.versionConfiguration = versionConfiguration;
  }

  verify(resources: any) {
    let s3Bucket;
    let isValid = true;

    for (var key in resources) {
      if (resources.hasOwnProperty(key)) {
        var value = resources[key];

        if (value.Type === S3_TYPE) {
          s3Bucket = value;
        }
      }
    }

    const properties = s3Bucket.Properties;
    require('colors');

    if (this.bucketName !== properties.BucketName) {
      console.log(`Error: BucketName '${this.bucketName}' does not match the CDK value`.red);
      isValid = false;
    }

    if (this.websiteConfiguration && this.websiteConfiguration.indexDocument !== properties.WebsiteConfiguration.IndexDocument) {
      console.log(`Error: WebsiteConfiguration.IndexDocument ${this.websiteConfiguration.indexDocument} does not match the CDK value`.red);
      isValid = false;
    }

    if (this.versionConfiguration && this.versionConfiguration.status !== properties.VersioningConfiguration.Status) {
      console.log(`Error: VersioningConfiguration.Status ${this.versionConfiguration.status} does not match the CDK value`.red);
      isValid = false;
    }

    // TODO Routing rules

    if (isValid) {
      console.log(`Successful verified ${S3_TYPE}: '${this.bucketName}'`.green);
    } else {
      console.log('--------'.red);
      console.log(`Failed to validate Lambda: ${this.bucketName}`.red);
      console.log('--------'.red);
    }

    
    return isValid;
  }
};

export class MockWebsiteConfiguration {

  indexDocument: string;
  routingRules: RoutingRule[];

  constructor(
    indexDocument: string,
    routingRule: RoutingRule[]
  ) {
    this.indexDocument = indexDocument;
    this.routingRules = routingRule;
  }
}

export class RoutingRule {

  redirectRule: { hostName: string, replacePrefixWith: string };
  routingRuleCondition: { httpErrorReturnCode: string }

  constructor(
    redirectRule: { hostName: string, replacePrefixWith: string },
    routingRuleCondition: { httpErrorReturnCode: string }
  ) {
    this.redirectRule = redirectRule;
    this.routingRuleCondition = routingRuleCondition;
  }
}
