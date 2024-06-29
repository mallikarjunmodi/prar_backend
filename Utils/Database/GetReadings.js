import dbInstance from "../../DbInstance.js";

const GetReadings = async (res, userId, sensor = null) => {
  try {
    const db = await dbInstance.getLocalDb();
    let sensors = sensor ? [sensor] : ["bp", "bg", "t", "hr", "sp"];
    const uniqueDatesSet = new Set();

    for (const sensor of sensors) {
      const readings = await db
        .collection(`${sensor}_readings`)
        .aggregate([
          { $match: { userId: userId } },
          {
            $project: {
              _id: 0,
              date: {
                $dateToString: {
                  format: "%d/%m/%Y",
                  date: "$recorded_at"
                }
              }
            }
          },
          { $group: { _id: "$date" } }
        ])
        .toArray();

      readings.forEach(reading => uniqueDatesSet.add(reading._id));
    }

    const uniqueDates = Array.from(uniqueDatesSet);

    return res.json(uniqueDates);
  } catch (error) {
    console.log(error)
    res.json({
      message: "An Error Occurred when trying to retrieve sensor readings: ",
      error: true,
    });
  }
};

export default GetReadings;
