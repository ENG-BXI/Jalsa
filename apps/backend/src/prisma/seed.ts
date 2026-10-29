// 1 million row for all Table for test performance and load test
import 'dotenv/config';
import pg from 'pg';

const N = 1_000_000;
const TEXT_CHANNELS = N - N / 5; // 800,000 قناة TEXT
const SHIFT = 12345;

const client = new pg.Client({connectionString: process.env.DATABASE_URL});

async function step(name: string, sql: string) {
  const t = Date.now();
  await client.query(sql);
  console.log(`✔ ${name} (${((Date.now() - t) / 1000).toFixed(1)}s)`);
}

async function main() {
  await client.connect();
  await client.query('SET synchronous_commit = off');

  await step('clean', `TRUNCATE "channelMassage","directMassage","dmMembers","userSever","channel","server","user" CASCADE`);

  await step(
    'user',
    `
    INSERT INTO "user"(id, name, "userName", email, password, "jointAt")
    SELECT gen_random_uuid()::text, 'User ' || g, 'user_' || g,
           'user_' || g || '@example.com', 'seed-password-hash',
           now() - random() * interval '365 days'
    FROM generate_series(1::bigint, ${N}::bigint) g
  `
  );

  await client.query(`DROP TABLE IF EXISTS tmp_u`);
  await step(
    'tmp_u',
    `
    CREATE TEMP TABLE tmp_u AS
    SELECT id, (substring("userName" from 6))::bigint AS rn
    FROM "user" WHERE "userName" ~ '^user_[0-9]+$';
    CREATE INDEX ON tmp_u(rn);
    ANALYZE tmp_u;
  `
  );

  await step(
    'server',
    `
    INSERT INTO "server"(id, name, description, owner_id, "isPublic", "createdAt")
    SELECT gen_random_uuid()::text, 'server_' || g, 'Seeded server ' || g, u.id,
           (g % 3 = 0), now() - random() * interval '300 days'
    FROM generate_series(1::bigint, ${N}::bigint) g
    JOIN tmp_u u ON u.rn = g
  `
  );

  await client.query(`DROP TABLE IF EXISTS tmp_s`);
  await step(
    'tmp_s',
    `
    CREATE TEMP TABLE tmp_s AS
    SELECT id, owner_id, (substring(name from 8))::bigint AS rn
    FROM "server" WHERE name ~ '^server_[0-9]+$';
    CREATE INDEX ON tmp_s(rn);
    ANALYZE tmp_s;
  `
  );

  await step(
    'userSever',
    `
    INSERT INTO "userSever"(id, "serverId", "userId", role, "createdAt")
    SELECT gen_random_uuid()::text, s.id, u.id,
           CASE WHEN s.owner_id = u.id THEN 'OWNER' ELSE 'MEMBER' END,
           now()
    FROM generate_series(1::bigint, ${N}::bigint) g
    JOIN tmp_u u ON u.rn = g
    JOIN tmp_s s ON s.rn = ((g * 7919) % ${N}) + 1
  `
  );

  await step(
    'channel',
    `
    INSERT INTO "channel"(id, name, type, "serverId", "createdAt")
    SELECT gen_random_uuid()::text, 'channel-' || g,
           CASE WHEN g % 5 = 0 THEN 'VOICE' ELSE 'TEXT' END,
           s.id, now()
    FROM generate_series(1::bigint, ${N}::bigint) g
    JOIN tmp_s s ON s.rn = g
  `
  );

  await client.query(`DROP TABLE IF EXISTS tmp_c`);
  await step(
    'tmp_c',
    `
    CREATE TEMP TABLE tmp_c AS
    SELECT id, row_number() OVER (ORDER BY id) AS rn
    FROM "channel" WHERE type = 'TEXT';
    CREATE INDEX ON tmp_c(rn);
    ANALYZE tmp_c;
  `
  );

  await step(
    'channelMassage',
    `
    INSERT INTO "channelMassage"(id, "from", text, "channelId", "softDelete", "createdAt", "updatedAt")
    SELECT gen_random_uuid()::text, u.id, 'Message ' || m.g || ' ' || md5(m.g::text),
           c.id, false, m.t, m.t
    FROM (SELECT g, now() - random() * interval '200 days' AS t
          FROM generate_series(1::bigint, ${N}::bigint) g) m
    JOIN tmp_c c ON c.rn = (m.g % ${TEXT_CHANNELS}) + 1
    JOIN tmp_u u ON u.rn = m.g
  `
  );

  await step(
    'directMassage',
    `
    INSERT INTO "directMassage"(id, "from", "to", text, "softDelete", "createdAt", "updatedAt")
    SELECT gen_random_uuid()::text, a.id, b.id, 'DM ' || m.g || ' ' || md5(m.g::text),
           false, m.t, m.t
    FROM (SELECT g, now() - random() * interval '200 days' AS t
          FROM generate_series(1::bigint, ${N}::bigint) g) m
    JOIN tmp_u a ON a.rn = m.g
    JOIN tmp_u b ON b.rn = ((m.g + ${SHIFT}) % ${N}) + 1
  `
  );

  await step(
    'dmMembers',
    `
    INSERT INTO "dmMembers"(id, "senderId", "receiverId")
    SELECT gen_random_uuid()::text, a.id, b.id
    FROM generate_series(1::bigint, ${N}::bigint) g
    JOIN tmp_u a ON a.rn = g
    JOIN tmp_u b ON b.rn = ((g + ${SHIFT}) % ${N}) + 1
  `
  );

  await step('ANALYZE', `ANALYZE`);
  await client.end();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
