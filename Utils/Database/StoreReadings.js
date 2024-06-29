import dbInstance from "../../DbInstance.js";
import { StartCheckingInternet } from "../../index.js";

// const recorded_at = () => {
//   return moment().format("MMM DD, YYYY [at] h:mm:ss A [UTC]Z")
// }

// const updated_at = () => {
//   return moment().format("MMM DD, YYYY [at] h:mm:ss A [UTC]Z")
// }

const StoreReadings = async (userId, sensor, readings) => {
  try {
    
    const localDb = await dbInstance.getLocalDb();

    await localDb
      .collection(`${sensor}_last`)
      .updateOne(
        { userId },
        { $set: { readings,  recorded_at : new Date() } },
        { upsert: true }
      );
    await localDb
      .collection(`${sensor}_readings`)
      .insertOne({ userId, readings, recorded_at : new Date() });

    console.log("Updated Sensordata to Local MongoDB");

    try {
      const cloudDb = await dbInstance.getCloudDb();
      await cloudDb
        .collection(`${sensor}_last`)
        .updateOne(
          { userId },
          { $set: { readings , recorded_at : new Date() } },
          { upsert: true }
        );
      await cloudDb
        .collection(`${sensor}_readings`)
        .insertOne({ userId, readings , recorded_at : new Date() });

      console.log("Updated Sensordata to Cloud MongoDB");
    } catch (cloudError) {
      console.log(
        "Failed to store data to cloud DB, appending to queue: ",
        cloudError
      );
      await localDb
        .collection("sensor_data_queue")
        .insertOne({ userId, sensor, readings, recorded_at : new Date() });
        StartCheckingInternet()
    }
    
  } catch (error) {
    console.log("An Error Occurred During storing sensordata: ", error);
  }
};

export default StoreReadings;
