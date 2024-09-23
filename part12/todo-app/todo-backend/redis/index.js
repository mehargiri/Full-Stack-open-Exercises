const redis = require('redis');
require('util');
const { REDIS_URL } = require('../util/config');

let getAsync;
let setAsync;

if (!REDIS_URL) {
	const redisIsDisabled = () => {
		console.log('No REDIS_URL set, Redis is disabled');
		return null;
	};
	getAsync = redisIsDisabled;
	setAsync = redisIsDisabled;
} else {
	const client = redis.createClient({
		url: REDIS_URL,
	});

	getAsync = client.get.bind(client);
	setAsync = client.set.bind(client);

	client.connect().catch((err) => {
		console.error('Redis connection error:', err);
	});
}

module.exports = {
	getAsync,
	setAsync,
};
