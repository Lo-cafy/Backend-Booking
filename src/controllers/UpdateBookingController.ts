import { Request, Response } from 'express';
import { UpdateBookingService } from '../services/BookingUpdateService';
import { UpdateBookingRequest, ConfirmBookingRequest, Service } from '../types/booking.types';
import { serviceListingMethods } from '../grpc/serviceListingMethods';

const updateBookingService = new UpdateBookingService();

export class UpdateBookingController {
  // Confirm booking and fetch service details
  static async confirmBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ success: false, error: 'Booking ID is required' });

      const { user_id }: ConfirmBookingRequest = req.body;
      const bookingId = parseInt(id);
      if (isNaN(bookingId) || !user_id) {
        return res.status(400).json({ success: false, error: 'Invalid booking ID or user ID' });
      }

      const result = await updateBookingService.confirmBooking(bookingId, user_id);

      if (!result.success) return res.status(400).json({ success: false, error: result.error });

      let serviceDetails: Service | null = null;
      if (result.data?.service_id) {
        try {
          serviceDetails = (await serviceListingMethods.getServiceDetails(
            result.data.service_id.toString()
          )) as Service;
        } catch (grpcError) {
          console.warn(`⚠️ Could not fetch service details via gRPC: ${grpcError}`);
        }
      }

      res.json({
        success: true,
        message: result.message,
        data: { ...result.data, service_details: serviceDetails || null },
      });
    } catch (error: any) {
      console.error('Confirm booking error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  // Complete booking and fetch service details
  static async completeBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ success: false, error: 'Booking ID is required' });

      const bookingId = parseInt(id);
      if (isNaN(bookingId)) return res.status(400).json({ success: false, error: 'Invalid booking ID' });

      const result = await updateBookingService.completeBooking(bookingId);
      if (!result.success) return res.status(400).json({ success: false, error: result.error });

      let serviceDetails: Service | null = null;
      if (result.data?.service_id) {
        try {
          serviceDetails = (await serviceListingMethods.getServiceDetails(
            result.data.service_id.toString()
          )) as Service;
        } catch (grpcError) {
          console.warn(`⚠️ Could not fetch service details via gRPC: ${grpcError}`);
        }
      }

      res.json({
        success: true,
        message: result.message,
        data: { ...result.data, service_details: serviceDetails || null },
      });
    } catch (error: any) {
      console.error('Complete booking error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  // Start service and fetch service details
  static async startService(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ success: false, error: 'Booking ID is required' });

      const bookingId = parseInt(id);
      if (isNaN(bookingId)) return res.status(400).json({ success: false, error: 'Invalid booking ID' });

      const result = await updateBookingService.startService(bookingId);
      if (!result.success) return res.status(400).json({ success: false, error: result.error });

      let serviceDetails: Service | null = null;
      if (result.data?.service_id) {
        try {
          serviceDetails = (await serviceListingMethods.getServiceDetails(
            result.data.service_id.toString()
          )) as Service;
        } catch (grpcError) {
          console.warn(`⚠️ Could not fetch service details via gRPC: ${grpcError}`);
        }
      }

      res.json({
        success: true,
        message: result.message,
        data: { ...result.data, service_details: serviceDetails || null },
      });
    } catch (error: any) {
      console.error('Start service error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  // Update booking and fetch service details
  static async updateBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ success: false, error: 'Booking ID is required' });

      const bookingId = parseInt(id);
      if (isNaN(bookingId)) return res.status(400).json({ success: false, error: 'Invalid booking ID' });

      const updateData: UpdateBookingRequest = { booking_id: bookingId, ...req.body };
      const result = await updateBookingService.updateBooking(bookingId, updateData);
      if (!result.success) return res.status(400).json({ success: false, error: result.error });

      let serviceDetails: Service | null = null;
      if (result.data?.service_id) {
        try {
          serviceDetails = (await serviceListingMethods.getServiceDetails(
            result.data.service_id.toString()
          )) as Service;
        } catch (grpcError) {
          console.warn(`⚠️ Could not fetch service details via gRPC: ${grpcError}`);
        }
      }

      res.json({
        success: true,
        message: result.message,
        data: { ...result.data, service_details: serviceDetails || null },
      });
    } catch (error: any) {
      console.error('Update booking error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
}
