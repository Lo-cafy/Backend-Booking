import client from "./serviceListingClient";

export const serviceListingMethods = {
  getServiceDetails: (service_id: string) => {
    return new Promise((resolve, reject) => {
      client.GetServiceDetails(
        {
          service_id,
          include_photos: false,
          include_availability: false,
          include_reviews: false,
        },
        (err: any, response: any) => {
          if (err) {
            console.error("gRPC GetServiceDetails Error:", err);
            return reject(err);
          }
          resolve(response);
        }
      );
    });
  },
};
