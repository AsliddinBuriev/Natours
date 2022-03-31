import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: [true, 'Booking must belong to a user'],
	},
	tour: {
		type: mongoose.Schema.ObjectId,
		ref: 'Tour',
		required: [true, 'booking must belong to a tour'],
	},
	price: {
		type: Number,
		required: [true, 'Booking must have a price'],
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

BookingSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'user',
		select: 'name photo',
	}).populate({
		path: 'tour',
		select: 'name imageCover',
	});
	next();
});
export default mongoose.model('Booking', BookingSchema);
