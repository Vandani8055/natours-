// const mongoose = require('mongoose');
// const Tour = require('./tourModel');

// const reviewSchema = new mongoose.Schema(
//   {
//     review: {
//       type: String,
//       required: [true, 'Review can not be empty'],
//     },
//     rating: {
//       type: Number,
//       min: 1,
//       max: 5,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//     tour: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'Tour',
//       required: [true, 'Review must belong to a tour.'],
//     },
//     user: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'User',
//       required: [true, 'Review must belong to a user'],
//     },
//   },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   },
// );

// // One user give only 1 review for each Tour :
// reviewSchema.index({ tour : 1 , user : 1} , { unique : true});

// // Query middleware for populating data instead if "ID" :
// // reviewSchema.pre(/^find/, function (next) {
// //   this.populate({
// //     path: 'tour',
// //     select: 'name',
// //   }).populate({
// //     path: 'user',
// //     select: 'name photo',
// //   });
// //   next();
// // });

// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'user',
//     select: 'name photo',
//   });
//   next();
// });

// // Static Method : (directly in Model) : Instance method(on documents):
// reviewSchema.statics.caclAverageRatings = async function (tourId) {
//   const stats = await this.aggregate([
//     {
//       $match: { tour: tourId },
//     },
//     {
//       $group: {
//         _id: '$tour',
//         nRating: { $sum: 1 },
//         avgRating: { $avg: '$rating' },
//       },
//     },
//   ]);

//   // reflect change which realtime calc to tour itself : ass review add then calc all of avg and show in DB
//   if (stats.length > 0) {
//     await Tour.findByIdAndUpdate(tourId, {
//       ratingsQuantity: stats[0].nRating,
//       ratingsAverage: stats[0].avgRating,
//     });
//   } else {
//     await Tour.findByIdAndUpdate(tourId, {
//       ratingsQuantity: 0,
//       ratingsAverage: 4.5,
//     });
//   }
// };

// // Document middleware : 1
// reviewSchema.post('save', function () {
//   //bcz already doc  save in DB
//   // "this " point to current review:
//   this.constructor.caclAverageRatings(this.tour);
//   // Review.caclAverageRatings(this.tour);
// });

// // findOneAndDelete: , findOneAndUpdate:
// // query middleware :
// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   this.r = await this.findOne();
//   next();
// });

// reviewSchema.post(/^findOneAnd/, async function () {
//   // await this.findOne() not work here bcz query already executed:
//   await this.r.constructor.caclAverageRatings(this.r.tour);
// });

// const Review = mongoose.model('Review', reviewSchema);

// module.exports = Review;








// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Tour = require('./tourModel');
const User = require('./userModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

reviewSchema.post('save', function() {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;