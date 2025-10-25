import { serviceListingMethods } from './grpc/serviceListingMethods';

async function testGrpcConnection() {
  try {
    // Test GetServiceDetails
    console.log('\nTesting GetServiceDetails...');
    const serviceDetails = await serviceListingMethods.getServiceDetails('1', {
      includePhotos: true,
      includeAvailability: true
    });
    console.log('GetServiceDetails successful:', serviceDetails);

    // Test ValidateService
    console.log('\nTesting ValidateService...');
    const validateResult = await serviceListingMethods.validateService(
      '1',
      '2023-10-25',
      '10:00',
      '11:00',
      2
    );
    console.log('ValidateService successful:', validateResult);

    console.log('\n✅ All gRPC tests passed!');
    return true;
  } catch (error: any) {
    console.error('\n❌ gRPC test failed:', error.message);
    throw error;
  }
}

// Run the tests
console.log('Starting gRPC connection tests...');
testGrpcConnection()
  .then(() => {
    console.log('\nTests completed successfully');
    process.exit(0);
  })
  .catch(() => {
    console.error('\nTests failed');
    process.exit(1);
  });