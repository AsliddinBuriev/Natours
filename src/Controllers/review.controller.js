import Review from '../Models/review.model.js';
import Tour from '../Models/tour.model.js';
import Booking from '../Models/booking.model.js';
import catchAsync from '../Utils/catchAsyncError.js';
import CustomError from '../Utils/CustomError.js';

export const getAllReviews = catchAsync(async (req, res, next) => {
	const reviews = await Review.find({ tour: req.params.tourId });
	res.status(200).json({
		status: 'success',
		result: reviews.length,
		data: { reviews },
	});
});

export const createReview = catchAsync(async (req, res, next) => {
	const tour = await Tour.findById(req.params.tourId);
	if (!tour) return next(new CustomError('There is no tour found!', 404));
	let review = await Review.find({ user: req.user._id });
	if (review.length > 0)
		return next(new CustomError('You can review a tour only once!', 400));
	req.body.user = req.user._id;
	req.body.tour = req.params.tourId;
	review = await Review.create(req.body);
	res.status(201).json({
		status: 'success',
		result: 1,
		data: { review },
	});
});

export const updateReview = catchAsync(async (req, res, next) => {
	let review = await Review.findById(req.params.reviewId);
	if (!review) return next(new CustomError('The review is not found!', 404));
	if (review.user._id.toString() !== req.user._id.toString())
		return next(
			new CustomError('You are not allowed to update this review!', 401)
		);
	review.review = req.body.review;
	review.rating = req.body.rating;
	review.createdAt = Date.now();
	review = await review.save();
	res.status(200).json({
		status: 'success',
		result: 1,
		data: { review },
	});
});

export const deleteReview = catchAsync(async (req, res, next) => {
	//1. check if the review exist
	const review = await Review.findById(req.params.reviewId);
	if (!review) return next(new CustomError('The review is not found!', 404));
	//2. check if the user is the owner of the review
	if (review.user._id.toString() !== req.user._id.toString())
		return next(
			new CustomError('You are not allowed to delete this review!', 401)
		);
	//3. delete the review
	await Review.findByIdAndDelete(req.params.reviewId);
	await Review.calcAverageRatings(review.tour);
	res.status(200).json({
		status: 'success',
		data: null,
	});
});
