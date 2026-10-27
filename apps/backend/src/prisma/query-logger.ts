import type {SqlMiddleware} from '@prisma/orm-postgres/family-runtime';

export function queryLogger(): SqlMiddleware {
  return {
    name: 'query-logger',
    familyId: 'sql',

    async afterQuery(plan, result) {
      console.log(`\n\n[SQL ${Math.round(result.latencyMs)}ms] ${result.rowCount} rows · ${plan.sql}`);
    }
  };
}
