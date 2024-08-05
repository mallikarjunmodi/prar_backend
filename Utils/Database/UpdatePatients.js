import dbInstance from "../../DbInstance.js";

const UpdatePatients = async (patientdata, res) => {
  try {
    const db = await dbInstance.getLocalDb("users");
    const usersCollection = db.collection("patients");
    const result = await usersCollection.insertOne({
      ...patientdata,
      created_at: new Date(),
      updated_at: new Date(),
      hospital: "Hospital Name Here Example - (Avani)",
    });

    res.json({
      message: "MongoDB UpdatePatients Successful",
      patientdata,
    });
  } catch (error) {
    res.json({
      message: "An Error Occurred During UpdatePatients",
      error: true,
    });
  }
};

export default UpdatePatients;
