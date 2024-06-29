import dbInstance from "../../DbInstance.js";

const SignIn = async (user,res) => {
  try {
    const db = await dbInstance.getLocalDb("users");
    const usersCollection = db.collection("users");
    const foundUser = await usersCollection.findOne({
      username: user.username,
      pin: user.pin,
    });
    if (!foundUser) {
      res.json({
        userId: null,
        message: "Invalid credentials or user not found",
        error: true,
      });
    } else {
      res.json({
        userId: foundUser._id,
        username: foundUser.username,
        name: foundUser.name,
        message: `User ${foundUser.username} logged in`,
        upcoming_appointments: foundUser.upcoming_appointments,
        error: false,
      });
    }
  } catch (error) {
    res.json({
      userId: null,
      message: "An error occurred during signin",
      error: true,
    });
  } finally {
  }
};

export default SignIn;
