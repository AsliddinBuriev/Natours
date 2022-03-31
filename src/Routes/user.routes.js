import { Router } from 'express';
import { multerForUsers } from '../Utils/multer.file-upload.js';
import {
	signup,
	login,
	verifyLogin,
	verifyRole,
	updatePassword,
	forgotPassword,
	resetPassword,
} from '../Controllers/auth.controller.js';
import {
	getAllUsers,
	updateProfile,
	getProfile,
	deleteUser,
} from '../Controllers/user.controller.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:resetToken', resetPassword);

router.use(verifyLogin);
router.patch('/update-my-password', updatePassword);
router
	.route('/my-profile')
	.get(getProfile)
	.patch(multerForUsers, updateProfile)
	.delete(deleteUser);

router.use(verifyRole('admin'));

router.route('/:userId').delete(deleteUser);
router.get('/', getAllUsers);
export default router;
