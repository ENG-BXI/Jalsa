import {createClient} from 'redis';
import {env} from '../config/env.js';

const redisClient = createClient({
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
  socket: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT
  }
});

redisClient.on('error', err => console.log('Redis Client Error', err));


export default redisClient;
