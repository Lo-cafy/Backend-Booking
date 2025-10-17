

import { pool } from '../config/db';
import { CreateBookingRequest, ProcedureResponse } from '../types/booking.types';

export class BookingCreateService {
  async createBooking(bookingData: CreateBookingRequest): Promise<ProcedureResponse<{ booking_id: number }>> {
    try {
      const { 
        user_id, 
        service_id, 
        start_time, 
        end_time, 
        booking_title 
      } = bookingData;

      // Calculate minimal required values
      const start = new Date(start_time);
      const end = new Date(end_time);
      const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
      const bookingDate = start_time.split('T')[0];
      const bookingRef = `BK-${Date.now()}`;

      // Minimal insert with only NOT NULL fields
      const result = await pool.query(
        `INSERT INTO booking.bookings (
          booking_ref, service_id, user_id, provider_id, 
          booking_title, service_price, total_amount, currency_code,
          booking_date, start_time, end_time, duration_minutes,
          status, created_at, updated_at, is_deleted
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING booking_id`,
        [
          bookingRef,          // booking_ref
          service_id,          // service_id
          user_id,             // user_id
          3001,                // provider_id
          booking_title,       // booking_title
          75.00,               // service_price
          75.00,               // total_amount
          'USD',               // currency_code
          bookingDate,         // booking_date
          start_time,          // start_time
          end_time,            // end_time
          durationMinutes,     // duration_minutes
          'pending',           // status
          new Date().toISOString(), // created_at
          new Date().toISOString(), // updated_at
          false                // is_deleted
        ]
      );

      const bookingId = result.rows[0].booking_id;

      // Update optional fields if provided
      const {
        booking_description,
        service_address,
        meeting_instructions,
        special_instructions
      } = bookingData;

      if (booking_description || service_address || meeting_instructions || special_instructions) {
        await pool.query(
          `UPDATE booking.bookings 
           SET booking_description = COALESCE($1, booking_description),
               service_address = COALESCE($2, service_address),
               meeting_instructions = COALESCE($3, meeting_instructions),
               special_instructions = COALESCE($4, special_instructions),
               updated_at = CURRENT_TIMESTAMP
           WHERE booking_id = $5`,
          [
            booking_description,
            service_address,
            meeting_instructions,
            special_instructions,
            bookingId
          ]
        );
      }

      return {
        success: true,
        data: { booking_id: bookingId },
        message: 'Booking created successfully'
      };
    } catch (error: any) {
      console.error('Create booking service error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}