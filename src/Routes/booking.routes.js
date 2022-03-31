import { Router } from 'express';
import { verifyLogin, verifyRole } from '../Controllers/auth.controller.js';
import { checkout } from '../Controllers/booking.controller.js';

const router = Router();

router.get('/checkout/:tourId', verifyLogin, checkout);

export default router;
