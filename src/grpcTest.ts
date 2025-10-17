import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.join(__dirname, "proto/serviceListing.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const listingProto: any = grpc.loadPackageDefinition(packageDef).listing;
const client = new listingProto.ListingService("localhost:50051", grpc.credentials.createInsecure());

const testServiceId = "19";

client.GetServiceDetails({ service_id: testServiceId }, (err: any, res: any) => {
  if (err) {
    console.error("❌ gRPC call failed:", err);
  } else {
    console.log("✅ gRPC response received:");
    console.dir(res, { depth: null });
  }
});
