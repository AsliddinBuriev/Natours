import CustomizeError from '../Utils/CustomizeError.js';
export default (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	if (process.env.NODE_ENV === 'development') devError(res, err);
	if (process.env.NODE_ENV === 'production') prodError(res, err);
};

function devError(res, err) {
	res.status(err.statusCode).json({
		err,
	});
}

function prodError(res, err) {
	let error = Object.create(err);
	if (error.code === 11000) error = duplicateKey(error);
	if (error.name === 'CastError') error = castError(error);
	if (error.name === 'ValidationError') error = validationError(error);
	if (error.isOperational) {
		res.status(error.statusCode).json({
			status: error.status,
			message: error.message,
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
function castError(err) {
	const message = `${err.value} is not a valid id!`;
	return new CustomizeError(message, 400);
}
function validationError(err) {
	const errorMessages = Object.values(err.errors).map((val) => val.message);
	const message = `Invalid input data. ${errorMessages.join('. ')}`;
	return new CustomizeError(message, 400);
}
