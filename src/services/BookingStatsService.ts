import { pool } from '../config/db';
import { ProcedureResponse } from '../types/booking.types';

export class BookingStatsService {
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
}