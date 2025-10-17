import app from "./app";
import { testConnection } from "./config/db";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

// ------------------- EXPRESS SERVER -------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Express server running on port ${PORT}`);
  // Test DB connection without blocking server start
  testConnection();
});

// ------------------- gRPC SERVER -------------------
const PROTO_PATH = path.join(__dirname, "proto/serviceListing.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto: any = grpc.loadPackageDefinition(packageDef).listing;

const grpcServer = new grpc.Server();

grpcServer.addService(proto.ListingService.service, {
  GetServiceDetails: (call: any, callback: any) => {
    console.log("Received gRPC request:", call.request);
    // Example response
    callback(null, {
      service_id: call.request.service_id,
      name: "Test Service",
    });
  },
});

grpcServer.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Failed to start gRPC server:", err);
      return;
    }
    console.log(`🛠️ gRPC server running on port ${port}`);
    grpcServer.start();
  }
);
