#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/dfb9808e3f020f36d36115e50a354279dcb2927acc33727619b23718088d42bb/contract';
import endContract from '../../snapshots/dfb9808e3f020f36d36115e50a354279dcb2927acc33727619b23718088d42bb/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'channel',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('serverId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', {
            notNull: true,
            default: lit('TEXT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('channel_type_check_f9cf31de', "\"type\" IN ('TEXT', 'VOICE')"),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'channelMassage',
        columns: [
          col('channelId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('from', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('imageUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('softDelete', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('text', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'directMassage',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('from', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('imageUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('softDelete', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('text', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('to', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'server',
        columns: [
          col('admin_id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('avatar_url', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isPublic', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('jointAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('password', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'userSever',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('MEMBER'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('serverId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'userSever_role_check_50a44636',
            "\"role\" IN ('OWNER', 'ADMIN', 'MEMBER')",
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'server',
        constraint: 'server_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_userName_key',
        columns: ['userName'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'userSever',
        constraint: 'userSever_userId_serverId_key',
        columns: ['userId', 'serverId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'channel',
        index: 'channel_serverId_idx_cfc44675',
        columns: ['serverId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'channelMassage',
        index: 'channelMassage_channelId_idx_166d3598',
        columns: ['channelId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'channelMassage',
        index: 'channelMassage_from_idx_1f0d0ec9',
        columns: ['from'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'directMassage',
        index: 'directMassage_from_idx_1f0d0ec9',
        columns: ['from'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'directMassage',
        index: 'directMassage_to_idx_7ceca86a',
        columns: ['to'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'server',
        index: 'server_admin_id_idx_78cc3551',
        columns: ['admin_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'userSever',
        index: 'userSever_serverId_idx_cfc44675',
        columns: ['serverId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'userSever',
        index: 'userSever_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'channel',
        foreignKey: {
          name: 'channel_serverId_fkey',
          columns: ['serverId'],
          references: { schema: 'public', table: 'server', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'channelMassage',
        foreignKey: {
          name: 'channelMassage_channelId_fkey',
          columns: ['channelId'],
          references: { schema: 'public', table: 'channel', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'channelMassage',
        foreignKey: {
          name: 'channelMassage_from_fkey',
          columns: ['from'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'directMassage',
        foreignKey: {
          name: 'directMassage_from_fkey',
          columns: ['from'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'directMassage',
        foreignKey: {
          name: 'directMassage_to_fkey',
          columns: ['to'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'server',
        foreignKey: {
          name: 'server_admin_id_fkey',
          columns: ['admin_id'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'userSever',
        foreignKey: {
          name: 'userSever_serverId_fkey',
          columns: ['serverId'],
          references: { schema: 'public', table: 'server', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'userSever',
        foreignKey: {
          name: 'userSever_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
