import { pool } from '../config/db';
import {
  Booking,
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingSearchParams,
  ProcedureResponse,
  CancellationReason,
  BookingSource,
  BookingStatus,
  isBookingSource,
  PartialBookingUpdate
} from '../types/booking.types';

export class BookingService {
  
  /**
   * Create a new booking using the stored procedure
   */
  async createBooking(bookingData: CreateBookingRequest): Promise<ProcedureResponse<{ booking_id: number }>> {
    try {
      const { 
        user_id, 
        service_id, 
        start_time, 
        end_time, 
        booking_title,
        booking_description,
        service_address,
        meeting_instructions,
        special_instructions,
        booking_source = 'web' 
      } = bookingData;

      // Validate booking source
      const validatedSource = isBookingSource(booking_source) ? booking_source : 'web';

      // First, create the booking using the stored procedure
      const createResult = await pool.query(
        'SELECT * FROM booking.create_booking($1, $2, $3, $4, $5)',
        [user_id, service_id, start_time, end_time, validatedSource]
      );

      const bookingId = createResult.rows[0].create_booking;

      // Then update additional fields if provided
      const updateDetails: PartialBookingUpdate = {};
      
      if (booking_title) updateDetails.booking_title = booking_title;
      if (booking_description) updateDetails.booking_description = booking_description;
      if (service_address) updateDetails.service_address = service_address;
      if (meeting_instructions) updateDetails.meeting_instructions = meeting_instructions;
      if (special_instructions) updateDetails.special_instructions = special_instructions;

      if (Object.keys(updateDetails).length > 0) {
        await this.updateBookingDetails(bookingId, updateDetails);
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

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId: number): Promise<ProcedureResponse<Booking>> {
    try {
      const result = await pool.query(
        `SELECT 
          b.*,
          bp.status as payment_status,
          bp.amount as payment_amount,
          bp.payment_method,
          sl.name as service_name,
          sl.description as service_description
         FROM booking.bookings b
         LEFT JOIN booking.booking_payments bp ON b.booking_id = bp.booking_id
         LEFT JOIN services.service_listings sl ON b.service_id = sl.service_id
         WHERE b.booking_id = $1 AND b.is_deleted = false`,
        [bookingId]
      );
      
      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Booking not found'
        };
      }
      
      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error: any) {
      console.error('Get booking by ID service error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Search bookings with flexible parameters
   */
  async searchBookings(params: BookingSearchParams): Promise<ProcedureResponse<Booking[]>> {
    try {
      let query = `
        SELECT 
          b.*,
          sl.name as service_name,
          u.name as user_name,
          p.name as provider_name
        FROM booking.bookings b
        LEFT JOIN services.service_listings sl ON b.service_id = sl.service_id
        LEFT JOIN users.users u ON b.user_id = u.user_id
        LEFT JOIN users.users p ON b.provider_id = p.user_id
        WHERE b.is_deleted = false
      `;
      
      const queryParams: any[] = [];
      let paramCount = 0;

      if (params.user_id !== undefined) {
        paramCount++;
        query += ` AND b.user_id = $${paramCount}`;
        queryParams.push(params.user_id);
      }

      if (params.provider_id !== undefined) {
        paramCount++;
        query += ` AND b.provider_id = $${paramCount}`;
        queryParams.push(params.provider_id);
      }

      if (params.status !== undefined) {
        paramCount++;
        query += ` AND b.status = $${paramCount}`;
        queryParams.push(params.status);
      }

      if (params.booking_date !== undefined) {
        paramCount++;
        query += ` AND b.booking_date = $${paramCount}`;
        queryParams.push(params.booking_date);
      }

      // Add ordering
      query += ' ORDER BY b.created_at DESC';

      // Add pagination
      if (params.limit !== undefined) {
        paramCount++;
        query += ` LIMIT $${paramCount}`;
        queryParams.push(params.limit);
      }

      if (params.offset !== undefined) {
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        queryParams.push(params.offset);
      }

      const result = await pool.query(query, queryParams);
      
      return {
        success: true,
        data: result.rows
      };
    } catch (error: any) {
      console.error('Search bookings service error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get bookings by user ID
   */
  async getBookingsByUser(userId: number, limit?: number, offset?: number): Promise<ProcedureResponse<Booking[]>> {
    try {
      let query = `
        SELECT 
          b.*,
          sl.name as service_name,
          p.name as provider_name
        FROM booking.bookings b
        LEFT JOIN services.service_listings sl ON b.service_id = sl.service_id
        LEFT JOIN users.users p ON b.provider_id = p.user_id
        WHERE b.user_id = $1 AND b.is_deleted = false 
        ORDER BY b.created_at DESC
      `;
      
      const params: any[] = [userId];

      if (limit !== undefined) {
        params.push(limit);
        query += ` LIMIT $${params.length}`;
      }

      if (offset !== undefined) {
        params.push(offset);
        query += ` OFFSET $${params.length}`;
      }

      const result = await pool.query(query, params);
      
      return {
        success: true,
        data: result.rows
      };
    } catch (error: any) {
      console.error('Get bookings by user service error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get bookings by provider ID
   */
  async getBookingsByProvider(providerId: number, limit?: number, offset?: number): Promise<ProcedureResponse<Booking[]>> {
    try {
      let query = `
        SELECT 
          b.*,
          sl.name as service_name,
          u.name as user_name
        FROM booking.bookings b
        LEFT JOIN services.service_listings sl ON b.service_id = sl.service_id
        LEFT JOIN users.users u ON b.user_id = u.user_id
        WHERE b.provider_id = $1 AND b.is_deleted = false 
        ORDER BY b.created_at DESC
      `;
      
      const params: any[] = [providerId];

      if (limit !== undefined) {
        params.push(limit);
        query += ` LIMIT $${params.length}`;
      }

      if (offset !== undefined) {
        params.push(offset);
        query += ` OFFSET $${params.length}`;
      }

      const result = await pool.query(query, params);
      
      return {
        success: true,
        data: result.rows
      };
    } catch (error: any) {
      console.error('Get bookings by provider service error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Confirm a booking using stored procedure
   */
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

  /**
   * Complete a booking using stored procedure
   */
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

  /**
   * Start service for a booking using stored procedure
   */
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

  /**
   * Update booking details
   */
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

  /**
   * Cancel a booking using stored procedure
   */
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

  /**
   * Get booking statistics for a user or provider
   */
  async getBookingStats(userId: number, userType: 'user' | 'provider'): Promise<ProcedureResponse<any>> {
    try {
      const field = userType === 'user' ? 'user_id' : 'provider_id';
      
      const result = await pool.query(
        `SELECT 
          status,
          COUNT(*) as count,
          SUM(total_amount) as total_revenue
         FROM booking.bookings 
         WHERE ${field} = $1 AND is_deleted = false
         GROUP BY status`,
        [userId]
      );

      const stats = {
        total: 0,
        byStatus: {} as Record<string, number>,
        totalRevenue: 0
      };

      result.rows.forEach((row: any) => {
        stats.total += parseInt(row.count);
        stats.byStatus[row.status] = parseInt(row.count);
        stats.totalRevenue += parseFloat(row.total_revenue) || 0;
      });

      return {
        success: true,
        data: stats
      };
    } catch (error: any) {
      console.error('Get booking stats service error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check booking availability for a time slot
   */
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

  /**
   * Helper method to update booking details after creation
   */
  private async updateBookingDetails(bookingId: number, details: PartialBookingUpdate): Promise<void> {
    try {
      const updatableFields = [
        'booking_title',
        'booking_description', 
        'service_address',
        'meeting_instructions',
        'special_instructions'
      ];

      const setClauses: string[] = [];
      const values: any[] = [];
      let paramCount = 0;

      updatableFields.forEach(field => {
        const value = details[field as keyof Booking];
        if (value !== undefined) {
          paramCount++;
          setClauses.push(`${field} = $${paramCount}`);
          values.push(value);
        }
      });

      if (setClauses.length > 0) {
        values.push(bookingId);
        await pool.query(
          `UPDATE booking.bookings 
           SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
           WHERE booking_id = $${paramCount + 1}`,
          values
        );
      }
    } catch (error) {
      console.error('Update booking details helper error:', error);
      // Don't throw error here as it's a non-critical update
    }
  }

  /**
   * Get booking with full details including related data
   */
  async getBookingWithDetails(bookingId: number): Promise<ProcedureResponse<any>> {
    try {
      const result = await pool.query(
        `SELECT 
          b.*,
          sl.name as service_name,
          sl.description as service_description,
          sl.duration_minutes as service_duration,
          u.name as user_name,
          u.email as user_email,
          u.phone as user_phone,
          p.name as provider_name,
          p.email as provider_email,
          p.phone as provider_phone,
          bp.status as payment_status,
          bp.amount as payment_amount,
          bp.payment_method,
          bp.currency_code as payment_currency
         FROM booking.bookings b
         LEFT JOIN services.service_listings sl ON b.service_id = sl.service_id
         LEFT JOIN users.users u ON b.user_id = u.user_id
         LEFT JOIN users.users p ON b.provider_id = p.user_id
         LEFT JOIN booking.booking_payments bp ON b.booking_id = bp.booking_id
         WHERE b.booking_id = $1 AND b.is_deleted = false`,
        [bookingId]
      );
      
      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Booking not found'
        };
      }
      
      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error: any) {
      console.error('Get booking with details service error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}