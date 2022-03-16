import User from '../Models/user.model.js';
import catchAsyncError from '../Utils/catchAsyncError.js';

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
	const user = await User.findByIdAndDelete(req.params.id);
	res.status(200).json({
		status: 'success',
		message: 'User deleted',
		data: { user },
	});
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
	const { body, file } = req;
	if (file) {
		// update file on bucket
		// body.photo = file.filename;
	}
	const allowedUpdates = ['name', 'email', 'photo'];
	for (const key in body) {
		if (!allowedUpdates.includes(key)) delete body.key;
	}
	const user = await User.findByIdAndUpdate(req.user._id, body, {
		new: true,
		runValidators: true,
	});
	res.status(200).json({
		status: 'success',
		message: 'User updated',
		data: { user },
	});
});
