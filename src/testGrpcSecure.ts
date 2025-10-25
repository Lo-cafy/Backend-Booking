import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

async function testGrpcConnection() {
  // Load the proto file
  const PROTO_PATH = path.join(__dirname, '../proto/listing.proto');
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const listingProto = grpc.loadPackageDefinition(packageDefinition).listing as any;
  
  // Server configuration
  const SERVER_HOST = 'back-end-servicelisting-production-be0c.up.railway.app';
  const SERVER_PORT = '443';
  const address = `${SERVER_HOST}:${SERVER_PORT}`;
  
  console.log(`Attempting to connect to gRPC server at: ${address}`);
  
  // Create SSL credentials
  const sslCreds = grpc.credentials.createSsl();
  
  // Create client with SSL
  const client = new listingProto.ListingService(
    address,
    sslCreds,
    {
      'grpc.ssl_target_name_override': SERVER_HOST,
      'grpc.default_authority': SERVER_HOST,
    }
  );

  // Create a deadline for the request
  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 10);

  return new Promise((resolve, reject) => {
    // Test the connection with a simple GetService call
    client.waitForReady(deadline, (err: Error | null) => {
      if (err) {
        console.error('Failed to connect to gRPC server:', err.message);
        reject(err);
        return;
      }

      console.log('Successfully connected to gRPC server');
      
      // Create metadata for the request
      const metadata = new grpc.Metadata();
      
      // Try to make a call
      client.GetService({ service_id: "1" }, metadata, (err: any, response: any) => {
        if (err) {
          console.error('Failed to call GetService:', err.message);
          reject(err);
        } else {
          console.log('Successfully called GetService:', response);
          resolve(response);
        }
      });
    });
  });
}

// Run the test
console.log('Starting gRPC connection test...');
testGrpcConnection()
  .then(() => {
    console.log('✅ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  });