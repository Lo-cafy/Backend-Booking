import { pool } from '../config/db';
import { ProcedureResponse, CancellationReason } from '../types/booking.types';

export class CancelBookingService {
  async cancelBooking(bookingId: number, cancelledBy: number, reason: CancellationReason, notes?: string): Promise<ProcedureResponse> {
    try {
      await pool.query(
        'SELECT booking.cancel_booking($1, $2, $3, $4)',
        [bookingId, cancelledBy, reason, notes]
      );
      
      return {
        success: true,
        message: 'Booking cancelled successfully'
      };
    } catch (error: any) {
      console.error('Cancel booking service error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}