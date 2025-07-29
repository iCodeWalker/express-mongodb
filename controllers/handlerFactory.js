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

export const updateOne = (Model) => {
  return catchAsyncError(async (req, res, next) => {
    const documnet = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!documnet) {
      return next(new AppError('No documnet found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: documnet,
      },
    });
  });
};

export const createOne = (Model) => {
  return catchAsyncError(async (req, res, next) => {
    const newDocument = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDocument,
      },
    });
  });
};
