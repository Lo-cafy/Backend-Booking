import { pool } from '../config/db';
import { ProcedureResponse } from '../types/booking.types';

export class BookingAvailabilityService {
  async checkAvailability(providerId: number, startTime: string, endTime: string, excludeBookingId?: number): Promise<ProcedureResponse<{ available: boolean }>> {
    try {
      let query = `
        SELECT EXISTS (
          SELECT 1 
          FROM booking.bookings 
          WHERE provider_id = $1 
            AND is_deleted = false 
            AND status IN ('pending','confirmed','in_progress')
            AND tstzrange(start_time, end_time) && tstzrange($2, $3)
      `;
      
      const params: any[] = [providerId, startTime, endTime];

      if (excludeBookingId !== undefined) {
        query += ` AND booking_id != $4`;
        params.push(excludeBookingId);
      }

      query += `) as conflict_exists`;

      const result = await pool.query(query, params);
      
      const available = !result.rows[0].conflict_exists;

      return {
        success: true,
        data: { available },
        message: available ? 'Time slot is available' : 'Time slot is not available'
      };
    } catch (error: any) {
      console.error('Check availability service error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}