#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/44379735ee317af72c87b6d25b4a824529798288e2624b96577f6fcfa067a98d/contract';
import startContract from '../../snapshots/44379735ee317af72c87b6d25b4a824529798288e2624b96577f6fcfa067a98d/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/724f3175dbf33e50c347934b8a1181d94b8468793b2c10be96f7db8c37d54dfe/contract';
import endContract from '../../snapshots/724f3175dbf33e50c347934b8a1181d94b8468793b2c10be96f7db8c37d54dfe/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('age', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-user-age', {
        check: () => placeholder('backfill-user-age:check'),
        run: () => placeholder('backfill-user-age:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'user', column: 'age' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
