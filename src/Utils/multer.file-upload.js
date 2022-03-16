import multer from 'multer';
import CustomError from './CustomError.js';

const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new CustomError('Please upload only image files', 400));
	}
};
const storage = multer.memoryStorage();

export default multer({
	limits: { fileSize: 1048576 * 15 },
	fileFilter,
	storage,
});
