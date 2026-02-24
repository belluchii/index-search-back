const mongoose = require("mongoose");

const db = async () => {
  try {
    const uri = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/miDB";
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB conected");
  } catch (err) {
    console.error("MongoDB conection failed:", err);
    throw err;
  }
};

module.exports = db;
