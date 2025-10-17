import { pool } from '../config/db';
import { Booking, UpdateBookingRequest, ProcedureResponse } from '../types/booking.types';

export class UpdateBookingService {
  async confirmBooking(bookingId: number, userId: number): Promise<ProcedureResponse> {
    try {
      await pool.query(
        'SELECT booking.confirm_booking($1, $2)',
        [bookingId, userId]
      );
      
      return {
        success: true,
        message: 'Booking confirmed successfully'
      };
    } catch (error: any) {
      console.error('Confirm booking service error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async completeBooking(bookingId: number): Promise<ProcedureResponse> {
    try {
      await pool.query(
        'SELECT booking.complete_booking($1)',
        [bookingId]
      );
      
      return {
        success: true,
        message: 'Booking completed successfully'
      };
    } catch (error: any) {
      console.error('Complete booking service error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async startService(bookingId: number): Promise<ProcedureResponse> {
    try {
      await pool.query(
        'SELECT booking.start_service($1)',
        [bookingId]
      );
      
      return {
        success: true,
        message: 'Service started successfully'
      };
    } catch (error: any) {
      console.error('Start service service error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateBooking(bookingId: number, updateData: UpdateBookingRequest): Promise<ProcedureResponse<Booking>> {
    try {
      const {
        booking_title,
        booking_description,
        service_address,
        meeting_instructions,
        special_instructions,
        provider_notes,
        user_notes
      } = updateData;

      const result = await pool.query(
        `UPDATE booking.bookings 
         SET booking_title = COALESCE($1, booking_title),
             booking_description = COALESCE($2, booking_description),
             service_address = COALESCE($3, service_address),
             meeting_instructions = COALESCE($4, meeting_instructions),
             special_instructions = COALESCE($5, special_instructions),
             provider_notes = COALESCE($6, provider_notes),
             user_notes = COALESCE($7, user_notes),
             updated_at = CURRENT_TIMESTAMP
         WHERE booking_id = $8 AND is_deleted = false
         RETURNING *`,
        [
          booking_title,
          booking_description,
          service_address,
          meeting_instructions,
          special_instructions,
          provider_notes,
          user_notes,
          bookingId
        ]
      );

      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Booking not found or cannot be updated'
        };
      }

      return {
        success: true,
        message: 'Booking updated successfully',
        data: result.rows[0]
      };
    } catch (error: any) {
      console.error('Update booking service error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}