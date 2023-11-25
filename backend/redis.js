const { createClient } = require('redis');
const url = process.env.REDIS_URL;
const password = process.env.REDIS_PASSWORD;

let redis;

module.exports = (() => {
  redis ??= createClient({ url, password });
  return redis;
})();
