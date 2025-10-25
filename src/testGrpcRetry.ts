import { listingClient } from './grpc/serviceListingClient';
import * as grpc from '@grpc/grpc-js';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testGrpcConnection() {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`\nAttempt ${attempt}/${MAX_RETRIES} to connect to gRPC server...`);

      // Set deadline for connection
      const deadline = new Date();
      deadline.setSeconds(deadline.getSeconds() + 5);

      // Wait for ready state
      await new Promise<void>((resolve, reject) => {
        listingClient.waitForReady(deadline, (error?: Error) => {
          if (error) {
            console.error(`Connection attempt ${attempt} failed:`, error.message);
            reject(error);
          } else {
            console.log('Successfully connected to gRPC server');
            resolve();
          }
        });
      });

      // Try a simple service call for service_id 21 (check if ServiceListing has it)
      const result = await new Promise((resolve, reject) => {
        listingClient.GetService({ service_id: "21" }, (error: any, response: any) => {
          if (error) {
            console.error('Service call failed:', error.message);
            reject(error);
          } else {
            resolve(response);
          }
        });
      });

      console.log('Service call successful:', result);
      return result;

    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt < MAX_RETRIES) {
        console.log(`Waiting ${RETRY_DELAY/1000} seconds before retry...`);
        await wait(RETRY_DELAY);
      }
    }
  }

  throw new Error(`Failed to connect after ${MAX_RETRIES} attempts. Last error: ${lastError?.message}`);
}

// Run the test
console.log('Starting gRPC connection test...');
testGrpcConnection()
  .then((result) => {
    console.log('\n✅ Test completed successfully');
    console.log('Final result:', result);
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  });