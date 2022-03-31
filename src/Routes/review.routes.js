import { Router } from 'express';
import { verifyLogin, verifyRole } from '../Controllers/auth.controller.js';

import {
	getAllReviews,
	createReview,
	updateReview,
	deleteReview,
} from '../Controllers/review.controller.js';

const router = Router({ mergeParams: true });

router.get('/', getAllReviews);
router.use(verifyLogin, verifyRole('user'));
router.post('/', createReview);
router.route('/:reviewId').patch(updateReview).delete(deleteReview);
export default router;
