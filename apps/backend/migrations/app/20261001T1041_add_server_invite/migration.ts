#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/220d672b24fc7e149173039158f74321d18f270cba36d9b5f158bb25af71c951/contract';
import startContract from '../../snapshots/220d672b24fc7e149173039158f74321d18f270cba36d9b5f158bb25af71c951/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/39a82d415852666a0384f35b9e48eb3931fd48681d8148ef5da632f5179f3c53/contract';
import endContract from '../../snapshots/39a82d415852666a0384f35b9e48eb3931fd48681d8148ef5da632f5179f3c53/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

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
      this.createTable({
        schema: 'public',
        table: 'serverInvite',
        columns: [
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('expiresAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isMultiple', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('serverId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('usedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'dmMembers',
        constraint: 'dmMembers_senderId_receiverId_key',
        columns: ['senderId', 'receiverId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'serverInvite',
        constraint: 'serverInvite_code_key',
        columns: ['code'],
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
      this.createIndex({
        schema: 'public',
        table: 'serverInvite',
        index: 'serverInvite_serverId_idx_cfc44675',
        columns: ['serverId'],
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
      this.addForeignKey({
        schema: 'public',
        table: 'serverInvite',
        foreignKey: {
          name: 'serverInvite_serverId_fkey',
          columns: ['serverId'],
          references: { schema: 'public', table: 'server', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
