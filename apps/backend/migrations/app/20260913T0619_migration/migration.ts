#!/usr/bin/env -S node
import type {Contract as End} from '../../snapshots/220d672b24fc7e149173039158f74321d18f270cba36d9b5f158bb25af71c951/contract';
import endContract from '../../snapshots/220d672b24fc7e149173039158f74321d18f270cba36d9b5f158bb25af71c951/contract.json' with {type: 'json'};
import type {Contract as Start} from '../../snapshots/400d3b731455987cee5d94718d650968e761d8461ba8ad41e6f3702c9d152b02/contract';
import startContract from '../../snapshots/400d3b731455987cee5d94718d650968e761d8461ba8ad41e6f3702c9d152b02/contract.json' with {type: 'json'};
import {Migration, MigrationCLI, rawSql} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      // True rename, not drop+add — preserves every existing row's value.
      rawSql({
        id: 'rename.server.admin_id-to-owner_id',
        label: 'Rename column "admin_id" to "owner_id" on "server"',
        operationClass: 'additive',
        target: {id: 'postgres'},
        precheck: [
          {
            description: '"admin_id" still exists',
            sql: `SELECT EXISTS (
              SELECT 1 FROM information_schema.columns
              WHERE table_schema = 'public' AND table_name = 'server' AND column_name = 'admin_id'
            )`
          }
        ],
        execute: [
          {
            description: 'Rename the column',
            sql: 'ALTER TABLE "public"."server" RENAME COLUMN "admin_id" TO "owner_id"'
          }
        ],
        postcheck: [
          {
            description: '"owner_id" now exists',
            sql: `SELECT EXISTS (
              SELECT 1 FROM information_schema.columns
              WHERE table_schema = 'public' AND table_name = 'server' AND column_name = 'owner_id'
            )`
          }
        ]
      }),

      // Rename the foreign key constraint to match the new column name.
      rawSql({
        id: 'rename.server.admin_id_fkey-to-owner_id_fkey',
        label: 'Rename constraint "server_admin_id_fkey" to "server_owner_id_fkey"',
        operationClass: 'additive',
        target: {id: 'postgres'},
        precheck: [
          {
            description: 'old constraint name still exists',
            sql: `SELECT EXISTS (
              SELECT 1 FROM pg_constraint WHERE conname = 'server_admin_id_fkey'
            )`
          }
        ],
        execute: [
          {
            description: 'Rename the foreign key constraint',
            sql: 'ALTER TABLE "public"."server" RENAME CONSTRAINT "server_admin_id_fkey" TO "server_owner_id_fkey"'
          }
        ],
        postcheck: [
          {
            description: 'new constraint name now exists',
            sql: `SELECT EXISTS (
              SELECT 1 FROM pg_constraint WHERE conname = 'server_owner_id_fkey'
            )`
          }
        ]
      }),

      // Rename the index to match the new column name.
      rawSql({
        id: 'rename.server.admin_id_idx-to-owner_id_idx',
        label: 'Rename index "server_admin_id_idx_78cc3551" to "server_owner_id_idx_ade9f347"',
        operationClass: 'additive',
        target: {id: 'postgres'},
        precheck: [
          {
            description: 'old index name still exists',
            sql: `SELECT EXISTS (
              SELECT 1 FROM pg_class WHERE relname = 'server_admin_id_idx_78cc3551'
            )`
          }
        ],
        execute: [
          {
            description: 'Rename the index',
            sql: 'ALTER INDEX "server_admin_id_idx_78cc3551" RENAME TO "server_owner_id_idx_ade9f347"'
          }
        ],
        postcheck: [
          {
            description: 'new index name now exists',
            sql: `SELECT EXISTS (
              SELECT 1 FROM pg_class WHERE relname = 'server_owner_id_idx_ade9f347'
            )`
          }
        ]
      })
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
