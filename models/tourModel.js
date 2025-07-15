import mongoose from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';
/**
 * Schema
 */

/**
 * validation : checking if the entered value are in the right format and users have entered the right type of
 * value in the fields.
 *
 * sanitisation : to ensure that the inputed data is clean, as no malicious code is injected into our database.
 */

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or equal than 40 characters'],
      minLength: [10, 'A tour name must have more or equal than 10 characters'],
      // validate: [validator.isAlpha, 'Tour name should only contain alphabets'],
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'A Tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A Tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A Tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty should be one of the: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating msut be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A Tour must have a price'] },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (inputValue) {
          /**
           * A custom validator that checks if the price discount is greater than or equal to the price
           *
           * this points to the new document that we are going to create, so it will not work in case of update
           */
          return inputValue < this.price;
        },
        message: 'Dicount price ({VALUE}) should be less than price',
      },
    },
    summary: {
      type: String,
      required: [true, 'A Tour must have a description'],
      trim: true,
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, 'A Tour must have a cover image'],
    },
    images: [String],
    // ######### We can also limit the fields in schema #########
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    /** Schema options */
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Virtual properties: fields that we can define in our schema, but it will not be persisted.
 *  It will not be saved in our database.
 *
 * Fields like conversion of miles into km or feet in meters
 *
 * We cannot use virtual properties in query, because it is not a part of database.
 */

tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

/**
 * In Document middleware, just like express middleware
 * We can perform something between the two events
 *
 * Ex: Each time a document is saved, we can run a function between the save command and the actual saving of
 * the document.
 *
 * We can decide where to run the middleware before or after a certain event.
 *
 * Four types of middleware in mongoose
 * 1. document.
 * 2. query.
 * 3. aggregate
 * 4. model
 *
 */

// 1. document middleware : a middleware that can act on a currently processed document.
// This pre will make the middleware run before the actual event

/** Pre middleware */
// #### Pre-save hook ####

// ##### will work for save() and create() but not for insertMany() or update()
tourSchema.pre('save', function (next) {
  // This function will be called before the document is saved in the database.
  // ## "this" keyowrd points to the currently processed document

  // ###### Creating a slug ######
  this.slug = slugify(this.name, { lower: true });
  next();
});

/** Post middleware */
/**
 * Post middleware funtions are executed when all the pre middleware functions are completed
 */

tourSchema.post('save', function (doc, next) {
  // console.log(doc);
  next();
});

// 2. query middleware : allows us to run functions before or after a query is executed
/** Pre-find hook */

// #### This pre hook will run for all the strings that starts with "find"
tourSchema.pre(/^find/, function (next) {
  // ## "this" keyowrd points to the current query
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// tourSchema.pre('findOne', function (next) {
//   // ## "this" keyowrd points to the current query
//   this.find({ secretTour: { $ne: true } });
//   next();
// });
//

/**
 * post middleware for find
 */

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took: ${Date.now() - this.start} ms`);
  // console.log(docs)
  next();
});

// 3. Aggregation middleware : before and after the aggregation is executed
// ### aggregate-hook
tourSchema.pre('aggregate', function (next) {
  // this points to current aggregation object
  // console.log(this.pipeline());

  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

/**
 * Creating model out of schema
 */
const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
