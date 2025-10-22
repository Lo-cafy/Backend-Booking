import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// Path to the proto file
const PROTO_PATH = path.join(__dirname, '../proto/listing.proto');

// Load proto definition
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const listingProto = grpc.loadPackageDefinition(packageDefinition).listing as any;

// -------------------
// THE FIX IS HERE
// -------------------
// 1. Get the address from an environment variable
//    Default to 'localhost:50051' so it still works on your local computer
const GRPC_SERVER_ADDRESS = process.env.GRPC_SERVER_ADDRESS || 'localhost:50051';

console.log(`gRPC client attempting to connect to: ${GRPC_SERVER_ADDRESS}`);

// 2. Use that variable here
const client = new listingProto.ListingService(
  GRPC_SERVER_ADDRESS,
  grpc.credentials.createInsecure()
);

export default client;