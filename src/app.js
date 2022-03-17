import express from 'express';
import cors from 'cors';
import tourRouter from './Routes/tour.routes.js';
import userRouter from './Routes/user.routes.js';
import CustomError from './Utils/CustomError.js';
import errorController from './Controllers/error.controller.js';
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use('*', (req, res, next) => {
	next(new CustomError('No such route on this server!', 404));
});
app.use(errorController);
export default app;
