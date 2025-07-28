import Review from '../models/reviewModel.js';
import catchAsyncError from '../utils/catchAsyncError.js';

export const getAllReviews = catchAsyncError(async (req, res, next) => {
  //   const reviews = await Review.find().populate('User').populate('Tour');
  let filterObj = {};

  if (req.params.tourId) {
    filterObj = { tour: req.params.tourId };
  }

  const reviews = await Review.find(filterObj);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: reviews,
  });
});

export const createReview = catchAsyncError(async (req, res, next) => {
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }

  if (!req.body.user) {
    req.body.user = req.user.id;
  }

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newReview,
  });
});
