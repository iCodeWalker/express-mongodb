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
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour: tour,
    });
});

/** Login Form page */
export const getLoginForm = catchAsyncError(async (req, res) => {
  res.status(200).render('login', {
    title: 'Log In',
  });
});
