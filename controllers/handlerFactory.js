import APIFeatures from '../utils/apiFeatures.js';
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

export const getOne = (Model, populateOptions) => {
  return catchAsyncError(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const document = await query;

    if (!document) {
      return next(new AppError('No document found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });
};

export const getAll = (Model) => {
  return catchAsyncError(async (req, res, next) => {
    /** To allow nested GET request on the tour for reviews */
    let filterObj = {};

    if (req.params.tourId) {
      filterObj = { tour: req.params.tourId };
    }
    /** To allow nested GET request on the tour for reviews */

    const features = new APIFeatures(Model.find(filterObj), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    const data = await features.query;

    res.status(200).json({
      status: 'success',
      results: data.length,
      data: {
        data: data,
      },
    });
  });
};
