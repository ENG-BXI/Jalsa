#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/44379735ee317af72c87b6d25b4a824529798288e2624b96577f6fcfa067a98d/contract';
import startContract from '../../snapshots/44379735ee317af72c87b6d25b4a824529798288e2624b96577f6fcfa067a98d/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/aa1d844839e8883f9e36755f4038cda49e40a55cbccac622e81cd00fc8d00784/contract';
import endContract from '../../snapshots/aa1d844839e8883f9e36755f4038cda49e40a55cbccac622e81cd00fc8d00784/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('age', 'int4', {
          notNull: true,
          default: lit(0),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
