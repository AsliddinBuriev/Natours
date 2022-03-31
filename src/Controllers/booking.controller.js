import Booking from '../Models/booking.model.js';
import Tour from '../Models/tour.model.js';
import catchAsyncError from '../Utils/catchAsyncError.js';
import CustomError from '../Utils/CustomError.js';
import Stripe from 'stripe';

export const paymentIntent = catchAsyncError(async (req, res, next) => {
	const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
	const { paymentMethodType, currency, paymentMethodOptions } = req.body;
	const params = {
		payment_method_types: [paymentMethodType],
		amount: 1999,
		currency: currency,
	};
	const paymentIntent = await stripe.paymentIntents.create(params);
	res.send({
		clientSecret: paymentIntent.client_secret,
	});
});

export const createBooking = catchAsyncError(async (req, res, next) => {
	const { tour, user, price } = req.query;
	if (!tour || !user || !price)
		return next(new CustomError('Invalid request', 400));
	await Booking.create({ tour, user, price });
	res.redirect(req.originalUrl.split('?')[0]);
});
