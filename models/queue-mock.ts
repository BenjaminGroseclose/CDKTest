import { red, green } from 'colors';

const QUEUE_TYPE = "AWS::SQS::Queue";

export class MockQueue {

  private delaySeconds?: number;
  private visibilityTimeout?: number;
  private isFifo?: boolean;
  private dedupScope?: number;

  constructor(private queueName: string) { }

  isFifoQueue() {
    this.isFifo = true;
  }

  hasDelaySeconds(delaySeconds: number) {
    this.delaySeconds = delaySeconds;
  }

  hasVisibilityTimeout(visibilityTimeout: number) {
    this.visibilityTimeout = visibilityTimeout;
  }

  hasDeduplicationScope(dedupScope: DeduplicationScope) {
    this.dedupScope = dedupScope;
  }

  verify(resources: any): boolean {
    let queue;
    let isValid = true;

    for (var key in resources) {
      if (resources.hasOwnProperty(key)) {
        var value = resources[key];

        if (value.Type === QUEUE_TYPE && value.Properties.FunctionName == this.queueName) {
          queue = value;
        }
      }
    }

    const properties = queue.Properties;
    require('colors');

    if (this.isFifo && properties.FifoQueue === false) {
      console.log(`Error: Expected Fifo queue but was not Fifo.`.red);
      isValid = false;
    }

    if (this.delaySeconds && this.delaySeconds !== properties.DelaySeconds) {
      console.log(`Error: DelaySeconds '${this.delaySeconds}' does not match the CDK value`.red);
      isValid = false;
    }

    if (this.visibilityTimeout && this.visibilityTimeout !== properties.VisibilityTimeout) {
      console.log(`Error: VisibilityTimeout '${this.visibilityTimeout}' does not match the CDK value`.red);
      isValid = false;
    }

    if (this.dedupScope) {
      switch (this.dedupScope) {
        case DeduplicationScope.QUEUE:
          if (properties.DeduplicationScope !== 'queue') {
            console.log(`Error: Expected DeduplicationScope type 'QUEUE" but was not.`)
            isValid = false;
          }
          break;
        case DeduplicationScope.MESSAGE_GROUP:
          if (properties.DeduplicationScope !== 'messageGroup') {
            console.log(`Error: Expected DeduplicationScope type 'MESSAGE_GROUP" but was not.`)
            isValid = false;
          }
          break;
      }
    }

    if (isValid) {
      console.log(`Successful verified ${QUEUE_TYPE}: '${this.queueName}'`.green);
    } else {
      console.log('--------'.red);
      console.log(`Failed to validate Queue: ${this.queueName}`.red);
      console.log('--------'.red);
    }
    
    return isValid;
  }

}

export enum DeduplicationScope {
  QUEUE,
  MESSAGE_GROUP
}