import express from 'express';
import tourRouter from './Routes/tour.routes.js';
import CustomizeError from './Utils/CustomizeError.js';
import errorController from './Controllers/error.controller.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/tours', tourRouter);

app.use('*', (req, res, next) => {
	next(new CustomizeError('No such route on this server!', 404));
});
app.use(errorController);
export default app;
