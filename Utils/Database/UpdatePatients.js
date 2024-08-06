import dbInstance from "../../DbInstance.js";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

const UpdatePatients = async (patientdata, res) => {
  const generateNumber = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const dateString = `${year}${month}${day}`;

    const randomHex = uuidv4().replace(/-/g, "").substring(0, 16);

    const result = `${dateString}:${randomHex}`;

    return result;
  };

  try {
    if (patientdata.birthDate) {
      patientdata.birthDate = moment(patientdata.birthDate).format(
        "YYYY-MM-DDTHH:mm:ss.SSSZ"
      );
    }

    const db = await dbInstance.getCloudDb("prar_dashboard");
    const patientsCollection = db.collection("users");

    const result = await patientsCollection.insertOne({
      ...patientdata,
      created_at: new Date(),
      updated_at: new Date(),
      hospital: "Hospital Name Here Example - (Avani)",
      active: true,
      bmi: "",
      uid: "",
      deceased: false,
      maritalStatus: "",
      photo: "https://example.com/profile.jpg",
      contact: "",
      // email: "",
      pwd: "securepassword123",
      generalPractitioner: "clya8zndt00002e483icon9tn",
      age: "",
      userId: generateNumber(),
    });

    const insertedId = result.insertedId;

    console.log("MongoDB UpdatePatients Successful", insertedId);

    res.json({
      message: "MongoDB UpdatePatients Successful",
      userId: insertedId,
    });
  } catch (error) {
    console.error("An Error Occurred During UpdatePatients", error);

    res.status(500).json({
      message: "An Error Occurred During UpdatePatients",
      error: error.message,
    });
  }
};

export default UpdatePatients;
