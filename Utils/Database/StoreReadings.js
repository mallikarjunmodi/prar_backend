import moment from "moment";
import dbInstance from "../../DbInstance.js";

const StoreReadings = async (userId, sensor, readings) => {
  try {
    const localDb = await dbInstance.getLocalDb();
    const timestamp = moment().format("MMM DD, YYYY [at] h:mm:ss A [UTC]Z");

    await localDb
      .collection(`${sensor}_last`)
      .updateOne(
        { userId },
        { $set: { readings, timestamp } },
        { upsert: true }
      );
    await localDb
      .collection(`${sensor}_readings`)
      .insertOne({ userId, readings, timestamp });

    console.log("Updated Sensordata to Local MongoDB");

    try {
      const cloudDb = await dbInstance.getCloudDb();
      await cloudDb
        .collection(`${sensor}_last`)
        .updateOne(
          { userId },
          { $set: { readings, timestamp } },
          { upsert: true }
        );
      await cloudDb
        .collection(`${sensor}_readings`)
        .insertOne({ userId, readings, timestamp });

      console.log("Updated Sensordata to Cloud MongoDB");
    } catch (cloudError) {
      console.log(
        "Failed to store data to cloud DB, appending to queue: ",
        cloudError
      );
      await localDb
        .collection("sensor_data_queue")
        .insertOne({ userId, sensor, readings, timestamp });
    }
  } catch (error) {
    console.log("An Error Occurred During storing sensordata: ", error);
  }
};

export default StoreReadings;
