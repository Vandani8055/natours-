// const mongoose = require('mongoose');
// const slugify = require('slugify');
// const validator = require('validator');
// // const User = require('./userModel');
// // const { promises } = require('nodemailer/lib/xoauth2');
// ///////Create Schema for tours collection:

// const tourSchema = new mongoose.Schema(
//   {
//     //Schema definition , options
//     name: {
//       type: String,
//       required: [true, 'This is mandatory Plese enter ujnique name'],
//       unique: true,
//       trim: true,
//       maxlength: [40, 'A name have less or equal 40 characters'],
//       minlength: [10, 'A name have less or equal 10 characters'],
//       // validate : [validator.isAlpha, 'Tour name must only contain characters']
//     },
//     slug: String,

//     duration: {
//       type: Number,
//       required: [true, 'A tour must have duration'],
//     },
//     maxGroupSize: {
//       type: Number,
//       required: [true, 'A group must have group size'],
//     },
//     difficulty: {
//       type: String,
//       required: [true, 'A tour must have difficulty'],
//       enum: {
//         values: ['easy', 'medium', 'difficult'],
//         message: 'Difficulty is either : easy , medium , difficult',
//       },
//     },
//     ratingsAverage: {
//       type: Number,
//       default: 4.5,
//       min: [1, 'A rating must be above 1.0'],
//       max: [5, 'A rating must be below 5.0'],
//       set: (val) => Math.round(val * 10) / 10, /// 4.6666 =  46.666 = 4.7
//       // select: false
//     },
//     ratingsQuantity: {
//       type: Number,
//       default: 0,
//     },
//     price: {
//       type: Number,
//       required: [true, 'please add price here'],
//     },
//     priceDiscount: {
//       type: Number,
//       validate: {
//         validator: function (val) {
//           return val < this.price;
//         },
//         message: 'Discount price {VALUE} should be below regular price',
//       },
//       message: 'Discount price ({VALUE}) should be below regular price',
//     },
//     summary: {
//       type: String,
//       trim: true,
//       required: [true, 'A tour must have a description'],
//     },
//     description: {
//       type: String,
//       trim: true,
//     },
//     imageCover: {
//       type: String,
//       required: [true, 'A  tour mush have a  cover image'],
//     },
//     images: [String],
//     createAt: {
//       type: Date,
//       default: Date.now, //don't use () pthervise refresh then also time stuck..
//       select: false, //exclude fields from schema
//     },
//     startDates: [Date],
//     secretTour: {
//       type: Boolean,
//       default: false,
//     },
//     startLocation: {
//       // geoJSON :
//       type: {
//         type: String,
//         default: 'Point',
//         enum: ['Point'],
//       },
//       coordinates: [Number],
//       address: String,
//       description: String,
//     },
//     locations: [
//       {
//         type: {
//           type: String,
//           default: 'Point',
//           enum: ['Point'],
//         },
//         coordinates: [Number],
//         address: String,
//         description: String,
//         day: Number,
//       },
//     ],
//     guides: [
//       {
//         type: mongoose.Schema.ObjectId,
//         ref: 'User',
//       },
//     ],
//   },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   },
// );

// // tourSchema.index({price : 1});
// tourSchema.index({ price: 1, ratingsAverage: -1 }); //compund index for improve read performance.
// tourSchema.index({ slug: 1 });
// tourSchema.index({ startLocation : '2dsphere'});

// // -------------------------------------------------------------------------------------

// tourSchema.virtual('durationWeeks').get(function () {
//   // on this not use query bcz not part of DB
//   return this.duration / 7;
// });

// // virtual Populate :
// // Virtual populate
// tourSchema.virtual('reviews', {
//   ref: 'Review',
//   foreignField: 'tour', // field in reviewModel
//   localField: '_id', // field in tourModel
// });

// // ----------------------------------------------------------------------------------------

// // 1) DOCUMENT MIDDLEWARE : runs "before" .save() & .create() not in insertMany()...
// // "Pre save hook" or "pre save middleware":
// tourSchema.pre('save', function (next) {
//   // console.log(this);               //here "this" point to "current process document"
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// // code for tour guides embadding :
// // tourSchema.pre('save',  async function(this){
// //     const guidespromises = this.guides.map(async id => await User.findById(id));
// //     this.guides = await promises.all(guidespromises);
// //     next();
// // });

// // tourSchema.pre('save' , function(next){
// //     console.log('will savce documents...');
// //     next();
// // });

// // //"Post save hook" : run after all pre middleware is done there work....
// // tourSchema.post('save' , function(doc , next){
// //     console.log(doc);
// //     next();
// // });

// //---------------------------------------------------------------------------

// // 2) QUERY MIDDLAEWARE : (PRE FIND HOOK)

// tourSchema.pre(/^find/, function (next) {
//   //regex: for all start with "find"
//   // tourSchema.pre('find' , function(next){          //only "find" then "findbyId" show result
//   this.find({ secretTour: { $ne: true } }); //this keyword point to current query not whole doc.

//   this.start = Date.now(); //define it

//   next(); //:this" is "query object" so we can "chain as many methods on this"...
// });

// // other vise show data instead id we paste it in 2 place gettour, getalltour:....
// tourSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'guides',
//     select: '-__v -passwordChangeAt',
//   });
//   next();
// });

// //run after query executed...:
// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Quert took ${Date.now() - this.start} miliseconds!`); //execute-define time
//   // console.log(docs);
//   next();
// });

// // -------------------------------------------------------------------------------:

// //AGGREGATION MIDDLAEWARE: (REMOVE SECRET TOUR COUNT FROM THERE)

// // tourSchema.pre('aggregate', function (next) {
// //   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
// //   console.log(this.pipeline()); //"this" point to "current aggregation obj"
// //   next();
// // });

// //Create model for that schema : (model is blue print for documents):
// const Tour = mongoose.model('Tour', tourSchema);

// module.exports = Tour;






const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters']
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
  {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
]

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

// tourSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'guides',
//     select: '-__v -passwordChangedAt'
//   });

//   next();
// });


tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: 'name email role photo'
  });
  next();
});


// tourSchema.post(/^find/, function(docs, next) {
  // console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  // next();
// });

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;