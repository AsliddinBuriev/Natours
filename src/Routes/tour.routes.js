import { Router } from 'express';
import {
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour,
} from '../Controllers/tour.controllers.js';
import { verifyLogin, verifyRole } from '../Controllers/auth.controller.js';
const router = Router();

router.get('/', getAllTours);
router.route('/:id').get(getTour);
router.use(verifyLogin, verifyRole('admin'));
router.post('/', createTour);
router.route('/:id').patch(updateTour).delete(deleteTour);

export default router;
