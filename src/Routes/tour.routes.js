import { Router } from 'express';
import { multerForTours } from '../Utils/multer.file-upload.js';
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
router.post('/', multerForTours, createTour);
router.route('/:id').patch(multerForTours, updateTour).delete(deleteTour);

export default router;
