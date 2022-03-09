import { Router } from 'express';
import {
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour,
} from '../Controllers/tour.controllers.js';
const router = Router();

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default router;
