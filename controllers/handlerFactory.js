import AppError from '../utils/appError.js';
import catchAsyncError from '../utils/catchAsyncError.js';

export const deleteOne = (Model) => {
  return catchAsyncError(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new AppError('No document found with given data', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};
