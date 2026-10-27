import {StreamClient} from '@stream-io/node-sdk';
import {env} from '../../config/env.js';
export class StreamVideoService {
  private localeClient: StreamClient;
  constructor() {
    this.localeClient = new StreamClient(env.STREAM_API_KEY, env.STREAM_API_SECRET);
  }
  get client(): StreamClient {
    return this.localeClient;
  }
  generateStreamToken(userId: string): string {
    const validity = 24 * 60 * 60; // 1 day in seconds
    const token = this.localeClient.generateUserToken({user_id: userId, validity_in_seconds: validity});
    return token;
  }
}
