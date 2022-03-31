import mongoose from 'mongoose';
import Tour from './tour.model.js';
const reviewSchema = new mongoose.Schema(
	{
		tour: {
			type: mongoose.Schema.ObjectId,
			ref: 'Tour',
			required: [true, 'A review must belong to a tour.'],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'A review must belong to a user.'],
		},
		review: {
			type: String,
			required: [true, 'A review must have a review'],
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: [true, 'A review must have a rating'],
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

reviewSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'user',
		select: 'name photo',
	});
	next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
	const stats = await this.aggregate([
		{
			$match: { tour: tourId },
		},
		{
			$group: {
				_id: '$tour',
				nRating: { $sum: 1 },
				avgRating: { $avg: '$rating' },
			},
		},
	]);
	await Tour.findByIdAndUpdate(tourId, {
		ratingsQuantity: stats[0].nRating,
		ratingsAverage: stats[0].avgRating,
	});
};

reviewSchema.post('save', function () {
	this.constructor.calcAverageRatings(this.tour);
});
// 1. update ratings after delete and update

export default mongoose.model('Review', reviewSchema);
