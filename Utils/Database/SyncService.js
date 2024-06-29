import dbInstance from "../../DbInstance.js";
import { stopCheckingInternet} from "../../index.js";

export const SyncSensorData = async () => {
  try {

    
    const localDb = await dbInstance.getLocalDb();
    const cloudDb = await dbInstance.getCloudDb();

    const queueData = await localDb
      .collection("sensor_data_queue")
      .find()
      .toArray();

      if (queueData.length < 1) {
        console.log("No data to synchronize");
        stopCheckingInternet();
        return;
      }
      console.log("Local database changes detected, synchronizing...");

    for (const data of queueData) {
      const { userId, sensor, readings, recorded_at} = data;
      await cloudDb
        .collection(`${sensor}_readings`)
        .insertOne({ userId, readings, recorded_at });
      await cloudDb
        .collection(`${sensor}_last`)
        .updateOne(
          { userId },
          { $set: { readings,recorded_at } },
          { upsert: true }
        );

      await localDb
        .collection("sensor_data_queue")
        .deleteOne({ _id: data._id });
    }

    console.log("Data synchronized with cloud database");
  } catch (error) {
    console.log("An error occurred during synchronization: ");
  }
};

