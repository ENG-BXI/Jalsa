import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import type {Contract} from './contract.d.ts';
import contractJson from './contract.json' with {type: 'json'};
import {queryLogger} from './query-logger.js';

// const isProduction = process.env['NODE_ENV'] === 'production';
const isProduction = true;

export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
  middleware: isProduction ? [] : [queryLogger()]
});
