import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class DbInstance {
  constructor() {
    this.localUri = process.env.LOCAL_MONGODB_URI;
    this.cloudUri = process.env.CLOUD_MONGODB_URI;
    this.dbName = 'sensor_data';
    this.localClient = new MongoClient(this.localUri, { useNewUrlParser: true, useUnifiedTopology: true });
    this.cloudClient = new MongoClient(this.cloudUri, { useNewUrlParser: true, useUnifiedTopology: true });
  }

  async getLocalDb() {
    if (!this.localClient.isConnected()) {
      await this.localClient.connect();
    }
    return this.localClient.db(this.dbName);
  }

  async getCloudDb() {
    if (!this.cloudClient.isConnected()) {
      await this.cloudClient.connect();
    }
    return this.cloudClient.db(this.dbName);
  }
}

const instance = new DbInstance();
export default instance;