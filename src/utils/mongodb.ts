import mongoose from 'mongoose';

import { mongoConfig } from '../configs/prod';

class MongoDB {
  private connection: any;

  public async createConnection() {
    this.connection = await mongoose.connect(mongoConfig);
  }

  public getConnection() {
    if (!this.connection) this.createConnection();
    return this.connection;
  }

  public end() {
    console.log('Please wait, releasing Mongo connection...');
    this.connection.disconnect();
  }
}

export default new MongoDB();
