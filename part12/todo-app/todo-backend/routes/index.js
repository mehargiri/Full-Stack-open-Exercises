const express = require('express');
const router = express.Router();

const configs = require('../util/config');

let visits = 0;

/* GET index data. */
router.get('/', async (_req, res) => {
	visits++;

	res.send({
		...configs,
		visits,
	});
});

/* GET statistics */
router.get('/statistics', async (_req, res) => {
	const count = await getAsync('count');

	return res.json({ added_todos: parseInt(count) || 0 });
});

module.exports = router;
