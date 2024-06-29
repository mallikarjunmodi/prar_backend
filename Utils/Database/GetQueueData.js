import dbInstance from '../../DbInstance.js';

const GetQueueData = async () => {
  try {
    const db = await dbInstance.getLocalDb();

    const count = await db.collection('sensor_data_queue').countDocuments({});

    const isQueueNotEmpty = count > 0;

    return isQueueNotEmpty
  } catch (error) {
    return false;
  }
};

export default GetQueueData;
