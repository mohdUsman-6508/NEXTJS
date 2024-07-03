import mongoose, { Connection } from "mongoose";

// remember nextjs is not connected to db all the time, it connects when user give some input which require db connection
// so, check before making a connnection, if it has made already

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already Connected to DB!");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: "shadowtalk",
    });
    console.log(db);
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("Database connection failed!");
    process.exit(1);
  }
}

export default dbConnect;
