import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// Path to the proto file
const PROTO_PATH = path.join(__dirname, '../proto/serviceListing.proto');

// Load proto definition
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const listingProto = grpc.loadPackageDefinition(packageDefinition).listing as any;

// Create client instance (connect to your friend’s gRPC server)
const client = new listingProto.ListingService(
  'localhost:50051', // your friend's gRPC server address
  grpc.credentials.createInsecure()
);

export default client;
