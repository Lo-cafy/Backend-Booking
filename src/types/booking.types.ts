/**
 * TypeScript interfaces for booking system
 * Based on actual database schema from booking-items folder
 */

// Booking Status Enum
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED_USER = 'cancelled_user',
  CANCELLED_PROVIDER = 'cancelled_provider',
  NO_SHOW_USER = 'no_show_user',
  NO_SHOW_PROVIDER = 'no_show_provider',
  DISPUTED = 'disputed',
  REFUNDED = 'refunded'
}

// Booking Source Enum
export enum BookingSource {
  WEB = 'web',
  MOBILE_APP = 'mobile_app',
  API = 'api',
  ADMIN_PANEL = 'admin_panel'
}

// Cancellation Reason Enum
export enum CancellationReason {
  USER_REQUEST = 'user_request',
  PROVIDER_UNAVAILABLE = 'provider_unavailable',
  WEATHER = 'weather',
  EMERGENCY = 'emergency',
  PAYMENT_FAILED = 'payment_failed',
  SERVICE_NOT_AVAILABLE = 'service_not_available',
  OTHER = 'other'
}

// Fix: Update Booking interface to handle exactOptionalPropertyTypes
export interface Booking {
  booking_id: number;
  booking_ref: string;
  service_id: number;
  external_service_id?: string | null;
  user_id: number;
  provider_id: number;
  booking_title: string;
  booking_description?: string | null;
  service_price: number;
  platform_fee: number;
  taxes: number;
  total_amount: number;
  currency_code: string;
  booking_date: Date;
  start_time: Date;
  end_time: Date;
  duration_minutes: number;
  service_address?: string | null;
  service_location?: string | null; // POINT type
  meeting_instructions?: string | null;
  status: BookingStatus;
  booking_source: BookingSource;
  cancelled_at?: Date | null;
  cancellation_reason?: CancellationReason | null;
  cancellation_notes?: string | null;
  cancelled_by_user_id?: number | null;
  service_started_at?: Date | null;
  service_completed_at?: Date | null;
  special_instructions?: string | null;
  provider_notes?: string | null;
  user_notes?: string | null;
  user_rating?: number | null;
  provider_rating?: number | null;
  user_review?: string | null;
  provider_review?: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  is_deleted: boolean;
}

export interface CreateBookingRequest {
  user_id: number;
  service_id: number;
  start_time: string; // ISO timestamp
  end_time: string; // ISO timestamp
  booking_title: string;
  booking_description?: string;
  service_address?: string;
  meeting_instructions?: string;
  special_instructions?: string;
  booking_source?: BookingSource;
}

export interface UpdateBookingRequest {
  booking_id: number;
  booking_title?: string;
  booking_description?: string;
  service_address?: string;
  meeting_instructions?: string;
  special_instructions?: string;
  provider_notes?: string;
  user_notes?: string;
}

export interface BookingSearchParams {
  user_id?: number | undefined;
  provider_id?: number | undefined;
  status?: BookingStatus | undefined;
  booking_date?: string | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
}

export interface User {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  created_at: Date;
}

export interface Service {
  service_id: number;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  provider_id: number;
  status: string;
  is_active: boolean;
}

/**
 * TypeScript interfaces for stored procedure parameters and results
 */

// Common procedure result structure
export interface ProcedureResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Actual stored procedure parameters based on your database
export interface CreateBookingParams {
  p_user_id: number;
  p_service_id: number;
  p_start_time: string; // TIMESTAMPTZ
  p_end_time: string; // TIMESTAMPTZ
  p_source?: BookingSource; // booking_source_enum, defaults to 'web'
}

export interface ConfirmBookingParams {
  p_booking_id: number;
  p_user_id: number;
}

export interface CancelBookingParams {
  p_booking_id: number;
  p_cancelled_by: number; // user_id who cancelled
  p_reason: CancellationReason;
  p_notes?: string;
}

export interface CompleteBookingParams {
  p_booking_id: number;
}

export interface StartServiceParams {
  p_booking_id: number;
}

export interface SearchBookingsParams {
  p_user_id?: number;
  p_provider_id?: number;
  p_status?: BookingStatus;
  p_date?: string; // DATE format
}

// Search result structure from the search_bookings function
export interface BookingSearchResult {
  booking_id: number;
  booking_ref: string;
  booking_date: Date;
  status: BookingStatus;
  user_id?: number;
  provider_id?: number;
  booking_title?: string;
  total_amount?: number;
}

// Generic search parameters
export interface SearchParams {
  p_search_term?: string;
  p_limit?: number;
  p_offset?: number;
  p_sort_by?: string;
  p_sort_order?: 'ASC' | 'DESC';
}

// Request/Response types for controllers
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CancelBookingRequest {
  cancelled_by: number;
  reason: CancellationReason;
  notes?: string;
}

export interface ConfirmBookingRequest {
  user_id: number;
}

// Type guards for enum validation
export const isBookingStatus = (status: string): status is BookingStatus => {
  return Object.values(BookingStatus).includes(status as BookingStatus);
};

export const isBookingSource = (source: string): source is BookingSource => {
  return Object.values(BookingSource).includes(source as BookingSource);
};

export const isCancellationReason = (reason: string): reason is CancellationReason => {
  return Object.values(CancellationReason).includes(reason as CancellationReason);
};

// Helper type for partial updates that allows undefined
export type PartialBookingUpdate = {
  [K in keyof Booking]?: Booking[K] | undefined;
};