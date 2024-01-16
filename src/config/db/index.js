const mongoose = require("mongoose");

async function connect() {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connect to database successfully");
  } catch (error) {
    console.log("Connect to database failed");
    console.log(error);
  }
}

module.exports = connect;
