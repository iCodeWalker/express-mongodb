import mongoose from 'mongoose';
import Tour from './tourModel.js';

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must be created by a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictPopulate: false,
  }
);

/**
 * Creating indexes
 *
 * Preventing from creating duplicate reviews
 */
reviewSchema.index(
  {
    tour: 1,
    user: 1,
  },
  {
    unique: true,
  }
);

/**
 *
 * Creating a middleware to populate the user and tour fields with user data and tour data
 * inside the review documents
 */

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'user',
  //     select: 'name photo',
  //   }).populate({
  //     path: 'tour',
  //     select: 'name',
  //   });

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

/** Static methods
 *
 * This can be called directly on the models. Ex: Review.calcStats
 */

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // "this" points to current model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        numOfRatings: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);
  //   console.log(stats, 'calcAverageRatings');

  /** Updating values of ratingsQuantity and ratingsAverage on the tour documents */
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].numOfRatings,
      ratingsAverage: stats[0].averageRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // "this" points current document
  // "this.tour" is the id of the tour in the newly created review

  // this.constructor points to the current Model
  // Review.calcAverageRatings(this.tour);
  this.constructor.calcAverageRatings(this.tour);
});

/**
 * calculating "ratingsAverage" and "ratingsQuantity" again on update or deletion of the review
 *
 */

/**
 *  here we can't change the pre middleware to post, so that we can have access to the udpated review document
 *  because we want ot have access of the query, and in post middleware we don;t have access to the query
 */
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // this points to current query

  /**
   * For passing data from pre middleware to post middleware
   * We created property named "reviewDocument" on this variable
   */
  this.reviewDocument = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  /**
   * await this.findOne()
   *
   * can't do this here as in post middleware the query has already been executed
   */
  /** And here we can access the property */
  this.reviewDocument.constructor.calcAverageRatings(this.reviewDocument.tour);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
