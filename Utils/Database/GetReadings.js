import dbInstance from '../../DbInstance.js';

const GetReadings = async (userId, sensor = null) => {
  try {
    const db = await dbInstance.getLocalDb();
    let sensors = sensor ? [sensor] : ['bp', 'bg', 't', 'hr', 'sp'];
    const allReadings = {};

    for (const sensor of sensors) {
      allReadings[sensor] = await db.collection(`${sensor}_readings`)
                                    .find({ userId: userId }) 
                                    .toArray();
    }

    return allReadings;
  } catch (error) {
    console.log('An Error Occurred when trying to retrieve sensor readings: ', error);
  }
};

export default GetReadings;