import { createClient, RedisClientType } from 'redis';

import { redisConfig } from '../configs/prod';

class Redis {
  private client: RedisClientType;

  constructor() {
    this.client = createClient(redisConfig);

    this.client.on('error', (err: any) =>
      console.log('Redis Client Error', err)
    );
  }

  public async start() {
    await this.client.connect();
    await this.client.select(2);
  }

  public async get(key: string): Promise<any> {
    return await this.client.get(key);
  }

  public async set(key: string, value: any) {
    await this.client.set(key, value);
  }

  public async getRange(
    key: string,
    start: number = 0,
    stop: number = -1
  ): Promise<any[]> {
    return await this.client.lRange(key, start, stop);
  }

  public async push(key: string, value: any) {
    await this.client.lPush(key, value);
  }

  public async lset(key: string, index: number, value: any) {
    await this.client.lSet(key, index, value);
  }

  public async delete(key: string) {
    await this.client.del(key);
  }
}

export default new Redis();
