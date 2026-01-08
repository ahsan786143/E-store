import mongoose from "mongoose";

const connectToDatabase = async (req) => {
  
  if (mongoose.connection.readyState >= 1) {
   
    return mongoose.connection;
  }

  const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/";

  try {
    await mongoose.connect(mongoURI, {
      dbName: "e-store",
    });

    console.log("Connected to MongoDB successfully");
    return mongoose.connection;
  } catch (error) {
    console.error(" Error connecting to MongoDB:", error.message);
    throw new Error("Database connection failed");
  }
};

export default connectToDatabase;
