import { Router } from 'express';
import { 
  CreateBookingController,
  GetBookingController,
  UpdateBookingController,
  CancelBookingController
} from '../controllers/index';

const router = Router();

// ===== CREATE OPERATIONS =====
// Create a new booking
router.post('/', CreateBookingController.createBooking);

// ===== READ OPERATIONS =====
// Search bookings
router.get('/search', GetBookingController.searchBookings);

// Get bookings by user
router.get('/user/:userId', GetBookingController.getBookingsByUser);

// Get bookings by provider
router.get('/provider/:providerId', GetBookingController.getBookingsByProvider);   

// Get a specific booking by ID
router.get('/:id', GetBookingController.getBooking);

// ===== UPDATE OPERATIONS =====
// Confirm a booking
router.put('/:id/confirm', UpdateBookingController.confirmBooking);

// Complete a booking
router.put('/:id/complete', UpdateBookingController.completeBooking);

// Start service for a booking
router.put('/:id/start', UpdateBookingController.startService);

// Update a booking (if needed)
router.put('/:id', UpdateBookingController.updateBooking);

// ===== DELETE OPERATIONS =====
// Cancel a booking
router.delete('/:id', CancelBookingController.cancelBooking);

export default router;
