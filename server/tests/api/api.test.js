import test, { after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { app } from '../../src/app.js';
import { pool } from '../../src/config/db.js';

after(async () => {
  await pool.end();
});

test('GET /api/health should return 200 with service information', async () => {
  const res = await request(app).get('/api/health');
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.status, 'success');
  assert.strictEqual(res.body.service, 'FC Barcelona La Liga DBMS API');
});

test('GET /api/seasons should return seasons list', async () => {
  const res = await request(app).get('/api/seasons');
  assert.ok(res.statusCode === 200 || res.statusCode === 503);
  if (res.statusCode === 200) {
    assert.strictEqual(res.body.status, 'success');
    assert.ok(Array.isArray(res.body.data));
  }
});

test('POST /api/auth/login with invalid payload should return validation or auth failure', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'nonexistent@user.com', password: 'wrongpassword' });
  assert.ok([400, 401, 503].includes(res.statusCode));
});

test('GET /api/admin/stats without token should be blocked with 401', async () => {
  const res = await request(app).get('/api/admin/stats');
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.body.status, 'fail');
});
