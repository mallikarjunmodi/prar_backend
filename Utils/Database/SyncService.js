import dbInstance from "../../DbInstance.js";

const syncData = async () => {
  try {
    const localDb = await dbInstance.getLocalDb();
    const cloudDb = await dbInstance.getCloudDb();

    const queueData = await localDb
      .collection("sensor_data_queue")
      .find()
      .toArray();
    for (const data of queueData) {
      const { userId, sensor, readings, timestamp } = data;
      await cloudDb
        .collection(`${sensor}_readings`)
        .insertOne({ userId, readings, timestamp });
      await cloudDb
        .collection(`${sensor}_last`)
        .updateOne(
          { userId },
          { $set: { readings, timestamp } },
          { upsert: true }
        );

      await localDb
        .collection("sensor_data_queue")
        .deleteOne({ _id: data._id });
    }

    console.log("Data synchronized with cloud database");
  } catch (error) {
    console.log("An error occurred during synchronization: ", error);
  }
};

export default syncData;
