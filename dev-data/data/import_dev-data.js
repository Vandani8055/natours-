const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');


// ----------------------config environment variable--------------------------------
dotenv.config({ path: './config.env' });
// --------------------------------DB connection(atlas)-----------------------------------------------
// const DB = process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD);
//retu promise so...handle by then and "con" --> is  "obj"


//with localdatabase:
// mongoose.connect(process.env.DATABASE_LOCAL, {

//with atlas:
// mongoose.connect(DB, {
//     useNewUrlParser:true,
//     useCreateIndex:true,
//     useFindAndModify:false
// }).then(() => console.log('Database connection sucessfully done'));


// const mongoURL = process.env.DATABASE;
// mongoose
//   .connect(mongoURL)
//   .then(() => {
//     console.log('DB connection successful!');
//     console.log('Connected DB:', mongoose.connection.name);
//     console.log('DB Host:', mongoose.connection.host);
//   })
//   .catch(err => console.log('DB ERROR:', err));



(async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log('✅ DB connection successful!');
    console.log('Connected DB:', mongoose.connection.name);
    console.log('DB Host:', mongoose.connection.host);
  } catch (err) {
    console.error('❌ DB ERROR:', err);
  }
})();





// ///READ JSON FILE : 
// const tours = fs.readFileSync('tours-simple.json' , 'utf-8'); //json
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));



// //IMPORT DATA TO DB:
// const importData = async () => {
//     try{
//         await Tour.create(tours);
//         await User.create(users , { validateBeforeSave : false});
//         await Review.create(reviews);

//         console.log('Data suceessfully loded!');                     //take array only
//         // process.exit();
//     }
//     catch(err) {
//          console.log(err);
//     }
// };



// FIX REVIEWS WITH NULL USERS : (not do this othervise genetare random review "one user give only one review features breck")
// const fixReviewUsers = async () => {
//   try {
//     const users = await User.find();
//     const reviews = await Review.find();

//     let i = 0;

//     for (let review of reviews) {
//       review.user = users[i % users.length]._id;
//       await review.save({ validateBeforeSave: false });
//       i++;
//     }

//     console.log('✅ Review users fixed!');
//   } catch (err) {
//     console.error(err);
//   }
// };




const importData = async () => {
  try {
    // 1. Create users first
    const createdUsers = await User.create(users, { validateBeforeSave: false });

    // 2. Get all user IDs
    const userIds = createdUsers.map(user => user._id);

    // 3. Assign random guides to each tour
    const modifiedTours = tours.map(tour => {
      const randomGuides = userIds
        .sort(() => 0.5 - Math.random())
        .slice(0, 2); // 2 guides per tour

      return {
        ...tour,
        guides: randomGuides
      };
    });

    // 4. Create tours with unique guides
    await Tour.create(modifiedTours);

    // 5. Create reviews
    await Review.create(reviews);

    console.log('✅ Data successfully loaded with different guides per tour!');
  } catch (err) {
    console.error(err);
  }
};


// //DELETE ALL DATA FROM DB:

const deleteData = async () => {
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data suceessfully deleted!'); 
        // process.exit();                  
    }
    catch(err) {
         console.log(err);
    }
};


if(process.argv[2] === '--import'){
    importData();
}
else if(process.argv[2] === '--delete'){
    deleteData();
}
// else if (process.argv[2] === '--fix-reviews') {
//   fixReviewUsers();
// }

// // console.log(process.argv);