const fs = require('fs');
const readline = require('readline');

const groups = {};

const rl = readline.createInterface({
  input: fs.createReadStream('stress-results.json'),
  crlfDelay: Infinity
});

rl.on('line', line => {
  try {
    const r = JSON.parse(line);

    if (r.type !== 'Point' || r.metric !== 'http_req_duration') return;

    const endpoint = r.data?.tags?.endpoint || 'unknown';
    (groups[endpoint] ??= []).push(r.data.value);
  } catch {}
});

rl.on('close', () => {
  for (const [endpoint, values] of Object.entries(groups)) {
    values.sort((a, b) => a - b);

    const count = values.length;
    const sum = values.reduce((total, value) => total + value, 0);
    const p95Index = Math.min(count - 1, Math.ceil(count * 0.95) - 1);

    let max = -Infinity;
    for (const value of values) {
      if (value > max) max = value;
    }

    console.log(endpoint.padEnd(30), `count=${count}`, `avg=${(sum / count).toFixed(2)}ms`, `p95=${values[p95Index].toFixed(2)}ms`, `max=${max.toFixed(2)}ms`);
  }
});
