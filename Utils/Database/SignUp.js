import dbInstance from "../../DbInstance.js";

const SignUp = async (userdata, res) => {
  try {
    const db = await dbInstance.getLocalDb("users");
    const usersCollection = db.collection("users");
    const result = await usersCollection.insertOne({
      ...userdata,
      upcoming_appointments: "No Upcoming Appointments",
      created_at: new Date(),
      updated_at: new Date(),
      role:"patient",
      userId:null
    });
    const insertedId = result.insertedId;

    res.json({ message: "MongoDB Signup Successful", userId: insertedId });
  } catch (error) {
    res.json({ message: "An Error Occurred During Signup", error: true });
  } finally {
  }
};

export default SignUp;
