#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/400d3b731455987cee5d94718d650968e761d8461ba8ad41e6f3702c9d152b02/contract';
import endContract from '../../snapshots/400d3b731455987cee5d94718d650968e761d8461ba8ad41e6f3702c9d152b02/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/dfb9808e3f020f36d36115e50a354279dcb2927acc33727619b23718088d42bb/contract';
import startContract from '../../snapshots/dfb9808e3f020f36d36115e50a354279dcb2927acc33727619b23718088d42bb/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [];
  }
}

MigrationCLI.run(import.meta.url, M);
