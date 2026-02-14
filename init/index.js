// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
// main()
//     .then(() =>{
//     console.log("Connected to DB");
//     })
//     .catch ((err) =>{
//     console.log(err);
//     });


// async function main(){
//     await mongoose.connect(MONGO_URL)
// }

// // const initDB = async () =>{
// //     await Listing.deleteMany({});
// //     await Listing.insertMany(initData.data);
// //     console.log("data was initialized");
// // }

// // initDB();


// const initDB = async() =>{
//     await Listing.deleteMany({});
//     initData.data = initData.data.map((obj) => ({...obj,owner :"67908d6861c1eda9f17999bc"}));
//     await Listing.insertMany(initData.data);
//     console.log("Data was Intitialized");
// }

// initDB();




require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLASDB2_URL;

// Connect to Atlas and seed data
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to Atlas DB");

    await initDB();

    await mongoose.connection.close();
    console.log("Connection Closed");
    process.exit(0);
  } catch (err) {
    console.log(err);
  }
}

const initDB = async () => {
  // Delete existing data
  await Listing.deleteMany({});
  console.log("Old data deleted");

  // Add owner to each listing
  const modifiedData = initData.data.map((obj) => ({
    ...obj,
    owner: "67908d6861c1eda9f17999bc",
  }));

  // Insert new data
  await Listing.insertMany(modifiedData);
  console.log("Data was Initialized");
};

main();
