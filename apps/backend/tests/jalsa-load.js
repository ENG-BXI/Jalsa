import http from 'k6/http';
import {check, sleep, fail} from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';
const EMAIL = __ENV.K6_EMAIL;
const PASSWORD = __ENV.K6_PASSWORD;

const SERVER_NAME = __ENV.SERVER_NAME || 'server1';
const SERVER_ID = __ENV.SERVER_ID || '44ededd7-a89b-4843-8598-d805f6ff5d85';
const CHANNEL_ID = __ENV.CHANNEL_ID || 'ed6a2104-718c-46d2-8d15-f882f389b9bc';
const USERNAME = __ENV.USERNAME || 'ENG';
const RECEIVER_USERNAME = __ENV.RECEIVER_USERNAME;

export const options = {
  discardResponseBodies: true,

  stages: [
    {duration: '30s', target: 100},
    {duration: '30s', target: 250},
    {duration: '30s', target: 500},
    {duration: '30s', target: 750},
    {duration: '30s', target: 1000},
    {duration: '2m', target: 1000},
    {duration: '30s', target: 0}
  ],

  thresholds: {
    http_req_failed: [{threshold: 'rate<0.05', abortOnFail: true}],
    http_req_duration: [{threshold: 'p(95)<1000', abortOnFail: true}],
    checks: ['rate>0.95']
  }
};

function getToken(res) {
  console.log(`Login status: ${res.status}`);
  console.log(`Login content-type: ${res.headers['Content-Type']}`);
  console.log(`Login response body: ${String(res.body).slice(0, 1500)}`);

  let body;

  try {
    body = res.json();
  } catch {
    fail(`Login response is not JSON. HTTP ${res.status}`);
  }

  return body?.accessToken ?? body?.token ?? body?.data?.accessToken ?? body?.data?.token;
}

export function setup() {
  if (!EMAIL || !PASSWORD) {
    fail('Set K6_EMAIL and K6_PASSWORD');
  }

  const res = http.post(
    `${BASE_URL}/api/v1/auth/login`,
    JSON.stringify({
      email: EMAIL,
      password: PASSWORD
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      },
      tags: {
        endpoint: 'login-setup'
      },
      responseType: 'text'
    }
  );

  if (res.status < 200 || res.status >= 300) {
    fail(`Login failed: HTTP ${res.status}`);
  }

  const token = getToken(res);

  if (!token) {
    fail('JWT not found. Check the login response token property.');
  }

  return {token};
}

const endpoints = [['auth-me', '/api/v1/auth/me'],
    ['user-by-username', `/api/v1/user/${encodeURIComponent(USERNAME)}`],
    ['my-servers', '/api/v1/server/my-servers'],
    ['server-number-of-members', `/api/v1/server/number-of-members/${SERVER_ID}`],
    
    ['server-all-members', `/api/v1/server/all-members/${SERVER_ID}`],
    ['public-servers', '/api/v1/server/public-server'],
    ['server-by-name', `/api/v1/server/name/${encodeURIComponent(SERVER_NAME)}`],
    ['server-by-id', `/api/v1/server/${SERVER_ID}`],
    ['channels-by-server', `/api/v1/channel/server/${encodeURIComponent(SERVER_NAME)}`],
    ['channel-by-id', `/api/v1/channel/${CHANNEL_ID}`],
    ['dm-members', '/api/v1/direct-message/dm-members']
    , ...(RECEIVER_USERNAME ? [['dm-messages', `/api/v1/direct-message/all-message/${encodeURIComponent(RECEIVER_USERNAME)}`]]
        : []), ['channel-messages', `/api/v1/channel-message/all-message/${CHANNEL_ID}`]];

export default function (data) {
  const params = {
    headers: {
      Authorization: `Bearer ${data.token}`
    },
    timeout: '15s'
  };

  for (const [name, path] of endpoints) {
    const res = http.get(`${BASE_URL}${path}`, {
      ...params,
      tags: {
        endpoint: name
      }
    });

    check(res, {
      [`${name}: HTTP 200`]: r => r.status === 200
    });
  }

  sleep(0.1);
}


/*
k6 test


k6 run -e BASE_URL=http://localhost:8000 -e K6_EMAIL='Abdo@gmail.com' -e K6_PASSWORD='123456789' -e SERVER_NAME='server1' -e SERVER_ID='44ededd7-a89b-4843-8598-d805f6ff5d85' -e CHANNEL_ID='ed6a2104-718c-46d2-8d15-f882f389b9bc' -e USERNAME='ENG' --out json=stress-results.json tests/jalsa-load.js

*/