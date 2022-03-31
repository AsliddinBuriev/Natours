import Booking from '../Models/booking.model.js';
import Tour from '../Models/tour.model.js';
import catchAsyncError from '../Utils/catchAsyncError.js';
import CustomError from '../Utils/CustomError.js';
import Stripe from 'stripe';

export const checkout = catchAsyncError(async (req, res, next) => {
	const tour = await Tour.findById(req.params.tourId);
	if (!tour) return next(new CustomError('Tour not found', 404));
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price_data: {
					currency: 'usd',
					unit_amount: tour.price * 100,
					product_data: {
						name: `${tour.name}`,
						description: tour.summary,
						images: [tour.imageCover],
					},
				},
				quantity: 1,
			},
		],
		customer_email: req.user.email,
		client_reference_id: req.params.tourId,
		mode: 'payment',
		payment_method_types: ['card'],
		success_url: `${req.protocol}://${req.get('host')}/?tour=${
			req.params.tourId
		}&user=${req.user._id}&price=${tour.price}`,
		cancel_url: `${req.protocol}://${req.get('host')}`,
	});
	res.status(200).json({
		status: 'success',
		message: 'Successfully created checkout session',
		url: session.url,
	});
});

export const createBooking = catchAsyncError(async (req, res, next) => {
	const { tour, user, price } = req.query;
	if (!tour || !user || !price)
		return next(new CustomError('Invalid request', 400));
	await Booking.create({ tour, user, price });
	res.redirect(req.originalUrl.split('?')[0]);
});
