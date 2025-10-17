// import { pool } from '../config/db';
// import { Booking, BookingSearchParams, ProcedureResponse, BookingStatus } from '../types/booking.types';

// export class GetBookingService {
//   async getBookingById(bookingId: number): Promise<ProcedureResponse<Booking>> {
//     try {
//       const result = await pool.query(
//         `SELECT 
//           b.*,
//           bp.status as payment_status,
//           bp.amount as payment_amount,
//           bp.payment_method,
//           sl.name as service_name,
//           sl.description as service_description
//          FROM booking.bookings b
//          LEFT JOIN booking.booking_payments bp ON b.booking_id = bp.booking_id
//          LEFT JOIN services.service_listings sl ON b.service_id = sl.service_id
//          WHERE b.booking_id = $1 AND b.is_deleted = false`,
//         [bookingId]
//       );
      
//       if (result.rows.length === 0) {
//         return {
//           success: false,
//           error: 'Booking not found'
//         };
//       }
      
//       return {
//         success: true,
//         data: result.rows[0]
//       };
//     } catch (error: any) {
//       console.error('Get booking by ID service error:', error);
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }

//   async searchBookings(params: BookingSearchParams): Promise<ProcedureResponse<Booking[]>> {
//     try {
//       let query = `
//         SELECT 
//           b.*,
//           sl.name as service_name,
//           u.name as user_name,
//           p.name as provider_name
//         FROM booking.bookings b
//         LEFT JOIN services.service_listings sl ON b.service_id = sl.service_id
//         LEFT JOIN users.users u ON b.user_id = u.user_id
//         LEFT JOIN users.users p ON b.provider_id = p.user_id
//         WHERE b.is_deleted = false
//       `;
      
//       const queryParams: any[] = [];
//       let paramCount = 0;

//       if (params.user_id !== undefined) {
//         paramCount++;
//         query += ` AND b.user_id = $${paramCount}`;
//         queryParams.push(params.user_id);
//       }

//       if (params.provider_id !== undefined) {
//         paramCount++;
//         query += ` AND b.provider_id = $${paramCount}`;
//         queryParams.push(params.provider_id);
//       }

//       if (params.status !== undefined) {
//         paramCount++;
//         query += ` AND b.status = $${paramCount}`;
//         queryParams.push(params.status);
//       }

//       if (params.booking_date !== undefined) {
//         paramCount++;
//         query += ` AND b.booking_date = $${paramCount}`;
//         queryParams.push(params.booking_date);
//       }

//       query += ' ORDER BY b.created_at DESC';

//       if (params.limit !== undefined) {
//         paramCount++;
//         query += ` LIMIT $${paramCount}`;
//         queryParams.push(params.limit);
//       }

//       if (params.offset !== undefined) {
//         paramCount++;
//         query += ` OFFSET $${paramCount}`;
//         queryParams.push(params.offset);
//       }

//       const result = await pool.query(query, queryParams);
      
//       return {
//         success: true,
//         data: result.rows
//       };
//     } catch (error: any) {
//       console.error('Search bookings service error:', error);
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }

//   async getBookingsByUser(userId: number, limit?: number, offset?: number): Promise<ProcedureResponse<Booking[]>> {
//     try {
//       let query = `
//         SELECT 
//           b.*,
//           sl.name as service_name,
//           p.name as provider_name
//         FROM booking.bookings b
//         LEFT JOIN services.service_listings sl ON b.service_id = sl.service_id
//         LEFT JOIN users.users p ON b.provider_id = p.user_id
//         WHERE b.user_id = $1 AND b.is_deleted = false 
//         ORDER BY b.created_at DESC
//       `;
      
//       const params: any[] = [userId];

//       if (limit !== undefined) {
//         params.push(limit);
//         query += ` LIMIT $${params.length}`;
//       }

//       if (offset !== undefined) {
//         params.push(offset);
//         query += ` OFFSET $${params.length}`;
//       }

//       const result = await pool.query(query, params);
      
//       return {
//         success: true,
//         data: result.rows
//       };
//     } catch (error: any) {
//       console.error('Get bookings by user service error:', error);
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }

//   async getBookingsByProvider(providerId: number, limit?: number, offset?: number): Promise<ProcedureResponse<Booking[]>> {
//     try {
//       let query = `
//         SELECT 
//           b.*,
//           sl.name as service_name,
//           u.name as user_name
//         FROM booking.bookings b
//         LEFT JOIN services.service_listings sl ON b.service_id = sl.service_id
//         LEFT JOIN users.users u ON b.user_id = u.user_id
//         WHERE b.provider_id = $1 AND b.is_deleted = false 
//         ORDER BY b.created_at DESC
//       `;
      
//       const params: any[] = [providerId];

//       if (limit !== undefined) {
//         params.push(limit);
//         query += ` LIMIT $${params.length}`;
//       }

//       if (offset !== undefined) {
//         params.push(offset);
//         query += ` OFFSET $${params.length}`;
//       }

//       const result = await pool.query(query, params);
      
//       return {
//         success: true,
//         data: result.rows
//       };
//     } catch (error: any) {
//       console.error('Get bookings by provider service error:', error);
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }

//   async getBookingWithDetails(bookingId: number): Promise<ProcedureResponse<any>> {
//     try {
//       const result = await pool.query(
//         `SELECT 
//           b.*,
//           sl.name as service_name,
//           sl.description as service_description,
//           sl.duration_minutes as service_duration,
//           u.name as user_name,
//           u.email as user_email,
//           u.phone as user_phone,
//           p.name as provider_name,
//           p.email as provider_email,
//           p.phone as provider_phone,
//           bp.status as payment_status,
//           bp.amount as payment_amount,
//           bp.payment_method,
//           bp.currency_code as payment_currency
//          FROM booking.bookings b
//          LEFT JOIN services.service_listings sl ON b.service_id = sl.service_id
//          LEFT JOIN users.users u ON b.user_id = u.user_id
//          LEFT JOIN users.users p ON b.provider_id = p.user_id
//          LEFT JOIN booking.booking_payments bp ON b.booking_id = bp.booking_id
//          WHERE b.booking_id = $1 AND b.is_deleted = false`,
//         [bookingId]
//       );
      
//       if (result.rows.length === 0) {
//         return {
//           success: false,
//           error: 'Booking not found'
//         };
//       }
      
//       return {
//         success: true,
//         data: result.rows[0]
//       };
//     } catch (error: any) {
//       console.error('Get booking with details service error:', error);
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }
// }


import { pool } from '../config/db';
import { Booking, BookingSearchParams, ProcedureResponse, BookingStatus } from '../types/booking.types';

export class GetBookingService {
  async getBookingById(bookingId: number): Promise<ProcedureResponse<Booking>> {
    try {
      const result = await pool.query(
        `SELECT 
          b.*,
          bp.status as payment_status,
          bp.amount as payment_amount,
          bp.payment_method
         FROM booking.bookings b
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
      console.error('Get booking by ID service error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async searchBookings(params: BookingSearchParams): Promise<ProcedureResponse<Booking[]>> {
    try {
      let query = `
        SELECT b.*
        FROM booking.bookings b
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

      query += ' ORDER BY b.created_at DESC';

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

  async getBookingsByUser(userId: number, limit?: number, offset?: number): Promise<ProcedureResponse<Booking[]>> {
    try {
      let query = `
        SELECT b.*
        FROM booking.bookings b
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

  async getBookingsByProvider(providerId: number, limit?: number, offset?: number): Promise<ProcedureResponse<Booking[]>> {
    try {
      let query = `
        SELECT b.*
        FROM booking.bookings b
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

  async getBookingWithDetails(bookingId: number): Promise<ProcedureResponse<any>> {
    try {
      const result = await pool.query(
        `SELECT 
          b.*,
          bp.status as payment_status,
          bp.amount as payment_amount,
          bp.payment_method,
          bp.currency_code as payment_currency
         FROM booking.bookings b
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