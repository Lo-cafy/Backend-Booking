import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../proto/listing.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const listingProto = grpc.loadPackageDefinition(packageDefinition).listing as any;

// -------------------
// ⬇ THIS IS THE FIX ⬇
// -------------------

// Get the address from environment variables
// Default to 'localhost:50051' for your local computer
const GRPC_SERVER_ADDRESS = process.env.GRPC_SERVER_ADDRESS || 'localhost:50051';

console.log(`gRPC client attempting to connect to: ${GRPC_SERVER_ADDRESS}`);

// Use the variable here instead of "localhost:50051"
const client = new listingProto.ListingService(
  GRPC_SERVER_ADDRESS,
  grpc.credentials.createInsecure()
);

export default client;