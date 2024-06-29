import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

class DbInstance {
  constructor() {
    this.localUri = process.env.LOCAL_MONGODB_URI;
    this.cloudUri = process.env.CLOUD_MONGODB_URI;

    this.localClient = new MongoClient(this.localUri);
    this.cloudClient = new MongoClient(this.cloudUri);
  }

  async getLocalDb(dbName = "sensor_data") {
    if (
      !this.localClient.topology ||
      !this.localClient.topology.isConnected()
    ) {
      await this.localClient.connect();
    }
    return this.localClient.db(dbName);
  }

  async getCloudDb(dbName = "sensor_data") {
    if (
      !this.cloudClient.topology ||
      !this.cloudClient.topology.isConnected()
    ) {
      await this.cloudClient.connect();
    }
    return this.cloudClient.db(dbName);
  }
}

const instance = new DbInstance();
export default instance;
