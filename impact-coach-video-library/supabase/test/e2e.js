// End-to-end verification of the app's data layer against a REAL Postgres
// running the unchanged schema.sql, exercising every flow exactly as the
// Next.js server actions do — under RLS, as the `authenticated` role with a
// JWT `sub` claim (which is what PostgREST/Supabase set per request).

const { Client } = require('pg');
// Override via env, e.g. PGHOST=localhost PGPORT=54322 PGUSER=postgres PGDATABASE=postgres
const conn = {
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || undefined,
  database: process.env.PGDATABASE || 'app',
};

const ADMIN = '11111111-1111-1111-1111-111111111111';
const COACH_A = '22222222-2222-2222-2222-222222222222';
const COACH_B = '33333333-3333-3333-3333-333333333333';

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log('  \x1b[32m✓\x1b[0m ' + name); }
  else { fail++; console.log('  \x1b[31m✗ FAIL\x1b[0m ' + name); }
}

const admin = new Client(conn);

// Run a set of statements as a given user (role=authenticated, jwt.sub=uid),
// each in its own transaction — mirroring one PostgREST request.
async function asUser(uid, fn) {
  const c = new Client(conn);
  await c.connect();
  try {
    await c.query('begin');
    await c.query("set local role authenticated");
    await c.query("select set_config('request.jwt.claims', $1, true)", [
      JSON.stringify({ sub: uid, role: 'authenticated' }),
    ]);
    const out = await fn(c);
    await c.query('commit');
    return out;
  } catch (e) {
    await c.query('rollback').catch(() => {});
    throw e;
  } finally {
    await c.end();
  }
}
// Expect an operation to be rejected by RLS (throws).
async function expectDenied(label, uid, fn) {
  try { await asUser(uid, fn); check(label + ' (blocked)', false); }
  catch (e) {
    check(label + ' (blocked: ' + (e.code || e.message.slice(0, 30)) + ')',
      /row-level security|violates/i.test(e.message) || e.code === '42501');
  }
}

(async () => {
  await admin.connect();

  console.log('\n1) Signup → profile trigger');
  // Simulate three auth signups (GoTrue inserts into auth.users).
  await admin.query(
    `insert into auth.users (id, email, raw_user_meta_data) values
       ($1,'admin@team.com', '{"full_name":"Head Coach"}'),
       ($2,'coachA@team.com','{"full_name":"Coach A"}'),
       ($3,'coachB@team.com','{"full_name":"Coach B"}')`,
    [ADMIN, COACH_A, COACH_B]
  );
  const prof = await admin.query('select id, full_name, role from public.profiles order by email');
  check('3 profiles auto-created by trigger', prof.rows.length === 3);
  check('default role is coach', prof.rows.every((r) => r.role === 'coach'));
  check('full_name pulled from metadata', prof.rows.some((r) => r.full_name === 'Coach A'));

  // Promote the admin (the documented SQL step).
  await admin.query("update public.profiles set role='admin' where id=$1", [ADMIN]);

  console.log('\n2) Coach A adds a video + tags (server action: addVideo)');
  const catId = (await admin.query("select id from public.categories where name='Shooting'")).rows[0].id;
  const videoId = await asUser(COACH_A, async (c) => {
    const v = await c.query(
      `insert into public.videos (url, title, platform, thumbnail_url, notes, category_id, added_by, coach_name)
       values ('https://youtu.be/abc123','Form shooting','youtube',
               'https://i.ytimg.com/vi/abc123/hqdefault.jpg','great drill',$1,$2,'Coach A')
       returning id`,
      [catId, COACH_A]
    );
    const id = v.rows[0].id;
    await c.query("insert into public.video_tags (video_id, tag) values ($1,'shooting'),($1,'U12')", [id]);
    return id;
  });
  check('video inserted by owner', !!videoId);
  const tagCount = (await admin.query('select count(*) from public.video_tags where video_id=$1', [videoId])).rows[0].count;
  check('2 tags attached', tagCount === '2');

  console.log('\n3) RLS: a coach cannot insert a video as someone else');
  await expectDenied('Coach B forging added_by=Coach A', COACH_B, (c) =>
    c.query(`insert into public.videos (url, added_by) values ('https://x.com/v', $1)`, [COACH_A])
  );

  console.log('\n4) Favorites: once per coach + group count');
  await asUser(COACH_A, (c) => c.query('insert into public.favorites (video_id, user_id) values ($1,$2)', [videoId, COACH_A]));
  await asUser(COACH_B, (c) => c.query('insert into public.favorites (video_id, user_id) values ($1,$2)', [videoId, COACH_B]));
  const cnt = (await admin.query('select count(*) from public.favorites where video_id=$1', [videoId])).rows[0].count;
  check('group favorite count = 2', cnt === '2');
  // Favorite-once: a second favorite by the same coach must be rejected.
  await expectDenied('Coach A favoriting twice (unique constraint)', COACH_A, (c) =>
    c.query('insert into public.favorites (video_id, user_id) values ($1,$2)', [videoId, COACH_A])
  );
  // Unfavorite (toggle off).
  await asUser(COACH_A, (c) => c.query('delete from public.favorites where video_id=$1 and user_id=$2', [videoId, COACH_A]));
  const cnt2 = (await admin.query('select count(*) from public.favorites where video_id=$1', [videoId])).rows[0].count;
  check('after Coach A unfavorites, count = 1', cnt2 === '1');

  console.log('\n5) Library query shape (matches page.tsx select)');
  // Reproduces: videos + category name + tags + favorite count + is_favorited.
  const lib = await asUser(COACH_B, (c) => c.query(
    `select v.id, v.title, v.platform, cat.name as category,
            (select count(*) from public.favorites f where f.video_id=v.id) as favorite_count,
            exists(select 1 from public.favorites f where f.video_id=v.id and f.user_id=$1) as is_favorited,
            (select array_agg(t.tag) from public.video_tags t where t.video_id=v.id) as tags
       from public.videos v left join public.categories cat on cat.id=v.category_id
      order by v.created_at desc`, [COACH_B]));
  const row = lib.rows[0];
  check('row has category name (Shooting)', row.category === 'Shooting');
  check('favorite_count = 1', row.favorite_count === '1');
  check('is_favorited true for Coach B', row.is_favorited === true);
  check('tags array present', Array.isArray(row.tags) && row.tags.includes('shooting'));

  console.log('\n6) RLS: video deletion permissions (admin removes any; owner removes own)');
  // Coach B cannot delete Coach A's video — RLS yields 0 affected rows (not an error).
  const delB = await asUser(COACH_B, (c) => c.query('delete from public.videos where id=$1', [videoId]));
  check('Coach B deleting Coach A video affects 0 rows', delB.rowCount === 0);
  check('video still present', (await admin.query('select 1 from public.videos where id=$1', [videoId])).rowCount === 1);
  // Admin can delete any video.
  const delAdmin = await asUser(ADMIN, (c) => c.query('delete from public.videos where id=$1', [videoId]));
  check('admin deletes the video (1 row)', delAdmin.rowCount === 1);
  check('cascade removed its favorites', (await admin.query('select count(*) from public.favorites where video_id=$1', [videoId])).rows[0].count === '0');
  check('cascade removed its tags', (await admin.query('select count(*) from public.video_tags where video_id=$1', [videoId])).rows[0].count === '0');

  console.log('\n7) RLS: admin-only category management');
  await expectDenied('Coach A creating a category', COACH_A, (c) =>
    c.query("insert into public.categories (name) values ('Sneaky Cat')")
  );
  const newCat = await asUser(ADMIN, (c) => c.query("insert into public.categories (name) values ('Special Situations') returning id"));
  check('admin creates a category', newCat.rowCount === 1);
  await asUser(ADMIN, (c) => c.query("update public.categories set name='ATOs' where id=$1", [newCat.rows[0].id]));
  check('admin renamed the category', (await admin.query('select name from public.categories where id=$1', [newCat.rows[0].id])).rows[0].name === 'ATOs');
  await asUser(ADMIN, (c) => c.query('delete from public.categories where id=$1', [newCat.rows[0].id]));
  check('admin deleted the category', (await admin.query('select 1 from public.categories where id=$1', [newCat.rows[0].id])).rowCount === 0);

  console.log('\n8) Deleting a category leaves videos (set null), per FK rule');
  const v2 = await asUser(COACH_A, (c) => c.query(
    `insert into public.videos (url, added_by, category_id, coach_name) values ('https://tiktok.com/@x/1',$1,$2,'Coach A') returning id`,
    [COACH_A, catId]));
  await asUser(ADMIN, (c) => c.query('delete from public.categories where id=$1', [catId]));
  const orphan = await admin.query('select category_id from public.videos where id=$1', [v2.rows[0].id]);
  check('video survives category delete with category_id=null', orphan.rowCount === 1 && orphan.rows[0].category_id === null);

  await admin.end();
  console.log(`\n──────────────────────────────\nRESULT: ${pass} passed, ${fail} failed\n`);
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => { console.error('\n\x1b[31mHARNESS ERROR:\x1b[0m', e.message); process.exit(2); });
