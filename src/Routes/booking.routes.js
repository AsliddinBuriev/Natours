import { Router } from 'express';
import { verifyLogin, verifyRole } from '../Controllers/auth.controller.js';
import { paymentIntent } from '../Controllers/booking.controller.js';

const router = Router();

router.post('/create-payment-intent', verifyLogin, paymentIntent);

export default router;
