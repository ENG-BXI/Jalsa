#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/220d672b24fc7e149173039158f74321d18f270cba36d9b5f158bb25af71c951/contract';
import startContract from '../../snapshots/220d672b24fc7e149173039158f74321d18f270cba36d9b5f158bb25af71c951/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/aaa3566565efa0aa316cf8fd7e3d4082f4754379f4de4ba38b86335760e689f3/contract';
import endContract from '../../snapshots/aaa3566565efa0aa316cf8fd7e3d4082f4754379f4de4ba38b86335760e689f3/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'dmMembers',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('receiverId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('senderId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'dmMembers',
        constraint: 'dmMembers_senderId_receiverId_key',
        columns: ['senderId', 'receiverId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'dmMembers',
        index: 'dmMembers_receiverId_idx_fe124f44',
        columns: ['receiverId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'dmMembers',
        index: 'dmMembers_senderId_idx_4689c490',
        columns: ['senderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'dmMembers',
        index: 'dmMembers_senderId_receiverId_idx_e948b8bd',
        columns: ['senderId', 'receiverId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'dmMembers',
        foreignKey: {
          name: 'dmMembers_senderId_fkey',
          columns: ['senderId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'dmMembers',
        foreignKey: {
          name: 'dmMembers_receiverId_fkey',
          columns: ['receiverId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
