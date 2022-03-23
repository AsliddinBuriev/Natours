import Tour from '../Models/tour.model.js';
import catchAsyncError from '../Utils/catchAsyncError.js';
import CustomError from '../Utils/CustomError.js';
import S3 from '../Utils/S3Bucket.js';

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

export const getTour = catchAsyncError(async (req, res, next) => {
	const tour = await Tour.findById(req.params.id);
	if (!tour) return next(new CustomError('Tour not found!', 404));
	res.status(200).json({
		status: 'SUCCESS',
		message: 'Tour found!',
		data: { tour },
	});
});

export const createTour = catchAsyncError(async (req, res, next) => {
	const { files, body } = req;
	let newTour = new Tour(body);
	if (files) {
		const s3 = new S3(next);
		if (files.imageCover) {
			const path = `Tour/${newTour._id}/coverImage.webp`;
			const image = files.imageCover[0].buffer;
			newTour.imageCover = await s3.getImageUrl(path, image);
		}
		if (files.images) {
			newTour.images = [];
			for (let i = 0; i < files.images.length; i++) {
				const path = `Tour/${newTour._id}/image-${i}.webp`;
				const image = files.images[i].buffer;
				newTour.images.push(await s3.getImageUrl(path, image));
			}
		}
	}
	newTour = await newTour.save();
	res.status(201).json({
		status: 'SUCCESS',
		message: 'Tour created!',
		data: { newTour },
	});
});

export const updateTour = catchAsyncError(async (req, res, next) => {
	const { files, body } = req;
	const oldTour = await Tour.findById(req.params.id);
	if (!oldTour) return next(new CustomError('Tour not found!', 404));
	if (files) {
		const s3 = new S3(next);
		if (files.imageCover) {
			const path = `Tour/${oldTour._id}/coverImage.webp`;
			const image = files.imageCover[0].buffer;
			body.imageCover = await s3.getImageUrl(path, image);
		}
		if (files.images) {
			let pathPointer = 0;
			let filePointer = 0;
			if (!Array.isArray(body.images)) {
				body.images = body.images ? [body.images] : [];
			}
			if (body.images.length + files.images.length > 5)
				return next(
					new CustomError('A tour can have only 5 images!', 400)
				);
			while (pathPointer < 4 && filePointer < files.images.length) {
				const path = `Tour/${oldTour._id}/image-${pathPointer}.webp`;
				if (!body.images.includes(path)) {
					const image = files.images[filePointer].buffer;
					body.images.push(await s3.getImageUrl(path, image));
					filePointer++;
				}
				pathPointer++;
			}
		}
	}
	const updatedTour = await Tour.findByIdAndUpdate(req.params.id, body, {
		new: true,
		runValidators: true,
	});
	res.status(200).json({
		status: 'SUCCESS',
		message: 'Tour updated!',
		data: { updatedTour },
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
