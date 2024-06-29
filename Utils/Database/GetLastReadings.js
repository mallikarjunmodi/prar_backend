import dbInstance from '../../DbInstance.js';

const GetLastReadings = async (res,userId) => {
  try {
    const db = await dbInstance.getLocalDb();
    const sensors = ['bp', 'bg', 't', 'hr', 'sp'];
    const allReadings = {};

    for (const sensor of sensors) {
      allReadings[sensor] = await db.collection(`${sensor}_last`)
      .find({ userId: userId }) 
      .toArray();
    }

    return res.json(allReadings)
  } catch (error) {
    res.json({
      message: "An Error Occurred when trying to retrieve last readings: ",
      error: true,
    });
  }
};

export default GetLastReadings;