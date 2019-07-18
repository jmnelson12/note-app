const mongoose = require("mongoose");
const keys = require("./keys");

const connectDB = async isDev => {
    const db = isDev ? keys.DEV_MONGO_URI : keys.PROD_MONGO_URI;

    // try {
    //     await mongoose.connect(db, {
    //         useNewUrlParser: true,
    //         useCreateIndex: true,
    //         useFindAndModify: false
    //     });
    //     console.log("MongoDB Connected...");
    // } catch (err) {
    //     console.error(err.message);
    //     // Exit process with failure
    //     process.exit(1);
    // }
};

module.exports = connectDB;
