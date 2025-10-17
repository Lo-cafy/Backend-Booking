import { Request, Response } from 'express';
import { BookingCreateService } from '../services/BookingCreateService';
import { CreateBookingRequest } from '../types/booking.types';
import { serviceListingMethods } from '../grpc/serviceListingMethods';

const bookingCreateService = new BookingCreateService();

export class CreateBookingController {
  static async createBooking(req: Request, res: Response) {
    try {
      const bookingData: CreateBookingRequest = req.body;

      // Validate required fields
      if (
        !bookingData.user_id ||
        !bookingData.service_id ||
        !bookingData.start_time ||
        !bookingData.end_time ||
        !bookingData.booking_title
      ) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: user_id, service_id, start_time, end_time, booking_title'
        });
      }

      // Create booking
      const result = await bookingCreateService.createBooking(bookingData);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      let serviceDetails = null;

      // 🔗 Fetch related service details using gRPC
      try {
        serviceDetails = await serviceListingMethods.getServiceDetails(
          bookingData.service_id.toString()
        );
      } catch (grpcError) {
        console.warn(
          `⚠️ Could not fetch service details via gRPC: ${grpcError}`
        );
      }

      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          ...result.data,
          service_details: serviceDetails || null
        }
      });
    } catch (error: any) {
      console.error('Create booking error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
