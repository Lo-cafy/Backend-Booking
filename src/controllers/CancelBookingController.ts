import { Request, Response } from 'express';
import { CancelBookingService } from '../services/BookingCancelService';
import { CancellationReason, CancelBookingRequest } from '../types/booking.types';

const cancelBookingService = new CancelBookingService();

export class CancelBookingController {
  static async cancelBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Booking ID is required'
        });
      }
      
      const { cancelled_by, reason, notes }: CancelBookingRequest = req.body;

      const bookingId = parseInt(id);
      if (isNaN(bookingId) || !cancelled_by || !reason) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: cancelled_by, reason'
        });
      }

      // Validate cancellation reason
      if (!Object.values(CancellationReason).includes(reason)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid cancellation reason'
        });
      }

      const result = await cancelBookingService.cancelBooking(bookingId, cancelled_by, reason, notes);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      console.error('Cancel booking error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}