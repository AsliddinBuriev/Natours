import User from '../Models/user.model.js';
import catchAsyncError from '../Utils/catchAsyncError.js';
import S3 from '../Utils/S3Bucket.js';

export const updateProfile = catchAsyncError(async (req, res, next) => {
	const { body, file } = req;
	const prohibited = ['password', 'role', 'pwdChangedAt'];
	prohibited.forEach((el) => {
		if (body[el]) delete body[el];
	});
	if (file) {
		const path = `User/images/${req.user._id}`;
		const image = file.buffer;
		const s3 = new S3();
		body.photo = await s3.getImageUrl(path, image);
	}
	if (body.photo === 'undefined' || body.photo === 'null') {
		body.photo =
			'https://natours-storage.s3.ap-northeast-2.amazonaws.com/User/images/avatar.webp';
	}
	const user = await User.findByIdAndUpdate(req.user._id, body, {
		runValidators: true,
		new: true,
	});
	res.status(200).json({
		status: 'success',
		message: 'User updated',
		data: { user },
	});
});

export const getAllUsers = catchAsyncError(async (req, res, next) => {
	const users = await User.find();
	res.status(200).json({
		status: 'success',
		message: 'All users',
		data: { users },
	});
});

export const getProfile = catchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	if (!user) return next(new CustomError('User is not found!', 404));
	res.status(200).json({
		status: 'success',
		message: 'User',
		data: { user },
	});
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
	await User.findByIdAndDelete(req.params.userId);
	res.status(200).json({
		status: 'success',
		message: 'User deleted',
		data: null,
	});
});
