import { Router } from 'express';
import { 
  CreateBookingController,
  GetBookingController,
  UpdateBookingController,
  CancelBookingController
} from '../controllers/index';

const router = Router();

// ===== CREATE OPERATIONS =====
/**
 * @openapi
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingCreate'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', CreateBookingController.createBooking);

// ===== READ OPERATIONS =====
// Search bookings
/**
 * @openapi
 * /api/bookings/search:
 *   get:
 *     summary: Search bookings
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: search query
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/search', GetBookingController.searchBookings);

// Get bookings by user
/**
 * @openapi
 * /api/bookings/user/{userId}:
 *   get:
 *     summary: Get bookings by user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/user/:userId', GetBookingController.getBookingsByUser);

// Get bookings by provider
/**
 * @openapi
 * /api/bookings/provider/{providerId}:
 *   get:
 *     summary: Get bookings by provider
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/provider/:providerId', GetBookingController.getBookingsByProvider);   

// Get a specific booking by ID
/**
 * @openapi
 * /api/bookings/{id}:
 *   get:
 *     summary: Get a booking by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 */
router.get('/:id', GetBookingController.getBooking);

// ===== UPDATE OPERATIONS =====
// Confirm a booking
/**
 * @openapi
 * /api/bookings/{id}/confirm:
 *   put:
 *     summary: Confirm a booking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/:id/confirm', UpdateBookingController.confirmBooking);

// Complete a booking
/**
 * @openapi
 * /api/bookings/{id}/complete:
 *   put:
 *     summary: Complete a booking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/:id/complete', UpdateBookingController.completeBooking);

// Start service for a booking
/**
 * @openapi
 * /api/bookings/{id}/start:
 *   put:
 *     summary: Start service for a booking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/:id/start', UpdateBookingController.startService);

// Update a booking (if needed)
/**
 * @openapi
 * /api/bookings/{id}:
 *   put:
 *     summary: Update a booking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true 
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/:id', UpdateBookingController.updateBooking);

// ===== DELETE OPERATIONS =====
// Cancel a booking
/**
 * @openapi
 * /api/bookings/{id}:
 *   delete:
 *     summary: Cancel a booking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.delete('/:id', CancelBookingController.cancelBooking);

export default router;
