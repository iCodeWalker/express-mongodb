import Review from '../models/reviewModel.js';
import catchAsyncError from '../utils/catchAsyncError.js';

export const getAllReviews = catchAsyncError(async (req, res, next) => {
  const reviews = await Review.find().populate('User').populate('Tour');

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: reviews,
  });
});

export const createReview = catchAsyncError(async (req, res, next) => {
  const newReview = await Review.create(req.body)
    .populate('User')
    .populate('Tour');

  res.status(201).json({
    status: 'success',
    data: newReview,
  });
});
