import { Request, Response } from "express";
import { GetBookingService } from "../services/BookingGetService";
import { BookingSearchParams, BookingStatus } from "../types/booking.types";
import { serviceListingMethods } from "../grpc/serviceListingMethods";

const getBookingService = new GetBookingService();

export class GetBookingController {
  static async getBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Booking ID is required",
        });
      }

      const bookingId = parseInt(id);
      if (isNaN(bookingId)) {
        return res.status(400).json({
          success: false,
          error: "Invalid booking ID",
        });
      }

      const result = await getBookingService.getBookingById(bookingId);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          error: result.error,
        });
      }

      let serviceDetails = null;

      // 🔗 Fetch related service details using gRPC
      const booking = result.data;
      if (booking && booking.service_id) {
        try {
          serviceDetails = await serviceListingMethods.getServiceDetails(
            booking.service_id.toString()
          );

        } catch (grpcError) {
          console.warn(
            `⚠️ Could not fetch service details via gRPC: ${grpcError}`
          );
        }
      }

      res.json({
        success: true,
        data: {
          ...result.data,
          service_details: serviceDetails || null,
        },
      });
    } catch (error: any) {
      console.error("Get booking error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  // ✅ Optional — later you can also enrich list routes with gRPC
  static async searchBookings(req: Request, res: Response) {
    try {
      const searchParams: BookingSearchParams = {};

      if (req.query.user_id)
        searchParams.user_id = parseInt(req.query.user_id as string);
      if (req.query.provider_id)
        searchParams.provider_id = parseInt(req.query.provider_id as string);
      if (req.query.status)
        searchParams.status = req.query.status as BookingStatus;
      if (req.query.booking_date)
        searchParams.booking_date = req.query.booking_date as string;
      if (req.query.limit)
        searchParams.limit = parseInt(req.query.limit as string);
      if (req.query.offset)
        searchParams.offset = parseInt(req.query.offset as string);

      const result = await getBookingService.searchBookings(searchParams);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error,
        });
      }

      res.json({
        success: true,
        data: result.data,
      });
    } catch (error: any) {
      console.error("Search bookings error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  static async getBookingsByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: "User ID is required",
        });
      }

      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const offset = req.query.offset
        ? parseInt(req.query.offset as string)
        : undefined;

      const userIdNum = parseInt(userId);
      if (isNaN(userIdNum)) {
        return res.status(400).json({
          success: false,
          error: "Invalid user ID",
        });
      }

      const result = await getBookingService.getBookingsByUser(
        userIdNum,
        limit,
        offset
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error,
        });
      }

      res.json({
        success: true,
        data: result.data,
      });
    } catch (error: any) {
      console.error("Get bookings by user error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  static async getBookingsByProvider(req: Request, res: Response) {
    try {
      const { providerId } = req.params;

      if (!providerId) {
        return res.status(400).json({
          success: false,
          error: "Provider ID is required",
        });
      }

      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const offset = req.query.offset
        ? parseInt(req.query.offset as string)
        : undefined;

      const providerIdNum = parseInt(providerId);
      if (isNaN(providerIdNum)) {
        return res.status(400).json({
          success: false,
          error: "Invalid provider ID",
        });
      }

      const result = await getBookingService.getBookingsByProvider(
        providerIdNum,
        limit,
        offset
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error,
        });
      }

      res.json({
        success: true,
        data: result.data,
      });
    } catch (error: any) {
      console.error("Get bookings by provider error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}
