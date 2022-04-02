import { Router } from 'express';
import { verifyLogin, verifyRole } from '../Controllers/auth.controller.js';
import {
	paymentIntent,
	createBooking,
} from '../Controllers/booking.controller.js';

const router = Router();

router.get('/create-payment-intent/:tourId', verifyLogin, paymentIntent);

router.post('/create-booking', createBooking);
export default router;
