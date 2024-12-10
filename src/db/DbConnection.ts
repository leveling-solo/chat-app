import mongoose from "mongoose";
let isConnected: boolean = false;
export async function Connect() {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB is already Connected");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URL!, {
      dbName: "Chat",
    });
    isConnected = true;
    console.log("MongoDBis connected Successfully");
  } catch (error) {
    console.log(error);
  }
}
