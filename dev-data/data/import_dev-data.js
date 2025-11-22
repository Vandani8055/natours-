const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');


// ----------------------config environment variable--------------------------------
dotenv.config({ path: './config.env' });
// --------------------------------DB connection(atlas)-----------------------------------------------
const DB = process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD);
//retu promise so...handle by then and "con" --> is  "obj"


//with localdatabase:
// mongoose.connect(process.env.DATABASE_LOCAL, {

//with atlas:
// mongoose.connect(DB, {
//     useNewUrlParser:true,
//     useCreateIndex:true,
//     useFindAndModify:false
// }).then(() => console.log('Database connection sucessfully done'));
mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.log('DB ERROR:', err));



///READ JSON FILE : 
// const tours = fs.readFileSync('tours-simple.json' , 'utf-8'); //json
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));



//IMPORT DATA TO DB:
const importData = async () => {
    try{
        await Tour.create(tours);
        await User.create(users , { validateBeforeSave : false});
        await Review.create(reviews);

        console.log('Data suceessfully loded!');                     //take array only
        process.exit();
    }
    catch(err) {
         console.log(err);
    }
};

//DELETE ALL DATA FROM DB:

const deleteData = async () => {
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data suceessfully deleted!'); 
        process.exit();                  
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
// console.log(process.argv);