// const mongoose = require('mongoose');
// const dotenv = require('dotenv');


// process.on('uncaughtException' , err =>{
//     console.log("UNCAUGHT EXCEPTION! 💥 Shutting Down");
//     console.log(err);           //here not work Async so let it be like that...
//     process.exit(1); 
// });



// // ----------------------config environment variable--------------------------------
// dotenv.config({ path: './config.env' });            //here other vise not login back

// const app = require('./app');


// // --------------------------------DB connection(atlas)-----------------------------------------------
// const DB = process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD);
// //retu promise so...handle by then and "con" --> is  "obj"



// //with localdatabase:
// // mongoose.connect(process.env.DATABASE_LOCAL, {

// //with atlas:
// // mongoose.connect(DB, {
// //     useNewUrlParser:true,
// //     useUnifiedTopology: true,
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true
// // }).then(() => console.log('Database connection sucessfully done'));
// mongoose
//   .connect(DB)
//   .then(() => console.log('DB connection successful!'))
//   .catch(err => console.log('DB connection error:', err));




// // ---------------------------// (JUst for testing to add data ):--------------------
// // const testTour = new Tour({
// //     name : "The forest hiker",
// //     // rating : 4.6,
// //     price : 997
// // });

// // testTour.save()
// // .then(doc => {
// //     console.log(doc);
// // })
// // .catch(err=> {
// //     console.log("ERROR : " , err);
// // });




// // -----------------------------------------------------------------------------------------
// //node use this env : set by express here 
// console.log(app.get('env'));        //develpoment 


// //node if self use mant env:(show all env of node use)
// // console.log(process.env);
 
// ////Start Server
// const port = process.env.PORT || 3000;
// const server = app.listen(port , () => {
//     console.log(`server is listening on ${port} ... `);
// });



// // NOTE : "uncuaght exceptions" : bugs that occure in out sync code but not handle any whereits called....

// ///handle globally "Undefined /Unhandle reject Promise globally :(in any where not just for wrong password in DB)
// process.on('unhandledRejection' , err =>{
//     console.log("UNHANDLE REJECTION! 💥 Shutting Down");
//      console.log(err);
//     server.close(() => {
//         process.exit(1);        // // 0 => for sucess , 1 => uncuaght exceptions
//     });
// });





const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');



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




const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  // console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shu/tting down...');
  // console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});


