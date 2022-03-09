import Tour from '../Models/tour.model.js';
import catchAsyncError from '../Utils/catchAsyncError.js';

export const getAllTours = catchAsyncError(async (req, res, next) => {
	const tours = await Tour.find().select(
		'-__v -maxGroupSize -description -images -startDates -secretTour'
	);
	res.status(200).json({
		status: 'SUCCESS',
		message: 'All tours!',
		data: { tours },
	});
});

export const createTour = catchAsyncError(async (req, res, next) => {
	const newTour = await Tour.create(req.body);
	res.status(201).json({
		status: 'SUCCESS',
		message: 'Tour created!',
		data: { newTour },
	});
});

export const getTour = catchAsyncError(async (req, res, next) => {
	const tour = await Tour.findById(req.params.id);
	res.status(200).json({
		status: 'SUCCESS',
		message: 'Tour found!',
		data: { tour },
	});
});

export const updateTour = catchAsyncError(async (req, res, next) => {
	const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	res.status(200).json({
		status: 'SUCCESS',
		message: 'Tour updated!',
		data: { tour },
	});
});

export const deleteTour = catchAsyncError(async (req, res, next) => {
	await Tour.findByIdAndDelete(req.params.id);
	res.status(200).json({
		status: 'SUCCESS',
		message: 'Tour deleted!',
		data: null,
	});
});
