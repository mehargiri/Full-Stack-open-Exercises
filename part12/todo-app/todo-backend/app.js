const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const todosRouter = require('./routes/todos');
const { getAsync } = require('./redis/index.js');

const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());

app.use('/', indexRouter);
app.use('/todos', todosRouter);

/* GET statistics */
app.get('/statistics', async (_req, res) => {
	const count = await getAsync('count');

	return res.json({ added_todos: parseInt(count) || 0 });
});

module.exports = app;
