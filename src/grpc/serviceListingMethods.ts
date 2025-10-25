import { listingClient } from "./serviceListingClient";

interface ServiceDetailsOptions {
  includePhotos?: boolean;
  includeAvailability?: boolean;
  includeReviews?: boolean;
}

export const serviceListingMethods = {
  getServiceDetails: (service_id: string, options: ServiceDetailsOptions = {}) => {
    return new Promise((resolve, reject) => {
      const request = {
        service_id,
        include_photos: options.includePhotos ?? false,
        include_availability: options.includeAvailability ?? false,
        include_reviews: options.includeReviews ?? false,
      };

      console.log('Calling GetServiceDetails:', request);
      
      listingClient.GetServiceDetails(request, (err: any, response: any) => {
        if (err) {
          console.error("gRPC GetServiceDetails Error:", err);
          return reject(err);
        }
        console.log('GetServiceDetails Response:', response);
        resolve(response);
      });
    });
  },

  validateService: (
    service_id: string,
    date: string,
    start_time: string,
    end_time: string,
    guests: number
  ) => {
    return new Promise((resolve, reject) => {
      const request = {
        service_id,
        date,
        start_time,
        end_time,
        guests
      };

      console.log('Calling ValidateService:', request);

      listingClient.ValidateService(request, (err: any, response: any) => {
        if (err) {
          console.error("gRPC ValidateService Error:", err);
          return reject(err);
        }
        console.log('ValidateService Response:', response);
        resolve(response);
      });
    });
  }
};
