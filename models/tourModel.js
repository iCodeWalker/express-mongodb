import mongoose from 'mongoose';
/**
 * Schema
 */

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour must have a name'],
      unique: true,
      trim: true,
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
    },
    ratingsAverage: { type: Number, default: 4.5 },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A Tour must have a price'] },
    priceDiscount: { type: Number },
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
 * Creating model out of schema
 */
const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
