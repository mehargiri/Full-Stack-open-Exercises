const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { xss } = require('express-xss-sanitizer');

const indexRouter = require('./routes/index');
const todosRouter = require('./routes/todos');
require('./redis/index.js');

const app = express();
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 200,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use(limiter);
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(xss());

app.use('/', indexRouter);
app.use('/todos', todosRouter);

module.exports = app;
