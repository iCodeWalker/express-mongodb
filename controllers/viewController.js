import Tour from '../models/tourModel.js';
import catchAsyncError from '../utils/catchAsyncError.js';

export const getOverview = catchAsyncError(async (req, res) => {
  /** 1. Get tour data from the collection */
  const tours = await Tour.find();

  /** 2. Build the template */

  /** 3. Render that template using tour data from collection */
  res.status(200).render('overview', {
    title: 'All tours',
    tours: tours,
  });
});

export const getTour = catchAsyncError(async (req, res) => {
  /** 1. get the data for requested tour, (includding reviews and guides) */

  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    field: 'review rating user',
  });

  /** 2. Build the template */

  /** 3. render the template using the data */
  res.status(200).render('tour', {
    title: 'tour',
    tour: tour,
  });
});
