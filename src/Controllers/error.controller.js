import CustomizeError from '../Utils/CustomizeError.js';
export default (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	// res.status(500).json({
	// 	err,
	// });
	let error = Object.create(err);
	if (error.code === 11000) error = duplicateKey(error);

	if (process.env.NODE_ENV === 'development') devError(res, error);
	if (process.env.NODE_ENV === 'production') prodError(res, error);
};

function devError(res, err) {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		error: err.code,
	});
}

function prodError(res, err) {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong',
		});
	}
}

function duplicateKey(err) {
	const message = `${err.keyValue.name} has already been used!`;
	return new CustomizeError(message, 400);
}
