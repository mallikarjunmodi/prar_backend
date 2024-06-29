import dbInstance from "../../DbInstance.js";

const GetAllUsers = async (res) => {
  try {
    const db = await dbInstance.getLocalDb("users");
    const usersCollection = db.collection("users");
    const users = await usersCollection.find({}).toArray();
    
    if (users.length === 0) {
      return res.json([]);
    }

    const userDetails = users.map((user) => ({
      username: user.username,
      name: user.name,
    }));
    
    res.json(userDetails);
  } catch (error) {
    res.json({
      userId: null,
      message: "An error occurred during getting users",
      error: true,
    });
  }
};

export default GetAllUsers;
