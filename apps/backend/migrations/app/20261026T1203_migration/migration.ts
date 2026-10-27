#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/39a82d415852666a0384f35b9e48eb3931fd48681d8148ef5da632f5179f3c53/contract';
import startContract from '../../snapshots/39a82d415852666a0384f35b9e48eb3931fd48681d8148ef5da632f5179f3c53/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/5e4e0a6b3b0afd4f4321bc346c02595bdc44ded050fdd0c6f20198258b1894ae/contract';
import endContract from '../../snapshots/5e4e0a6b3b0afd4f4321bc346c02595bdc44ded050fdd0c6f20198258b1894ae/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [];
  }
}

MigrationCLI.run(import.meta.url, M);
