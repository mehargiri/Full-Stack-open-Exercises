const express = require('express');
const { Todo } = require('../mongo');
const router = express.Router();
const { getAsync, setAsync } = require('../redis');

/* GET todos listing. */
router.get('/', async (_, res) => {
	const todos = await Todo.find({});
	res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
	const todo = await Todo.create({
		text: req.body.text,
		done: false,
	});

	const todo_count = parseInt(await getAsync('count')) || 0;

	await setAsync('count', todo_count + 1);
	return res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
	const { id } = req.params;
	req.todo = await Todo.findById(id);
	if (!req.todo) return res.sendStatus(404);

	next();
};

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
	await Todo.findByIdAndDelete(req.todo._id);
	res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
	res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
	const updatedTodo = await Todo.findByIdAndUpdate(req.todo._id, req.body, {
		new: true,
	});
	res.send(updatedTodo);
});

router.use('/:id', findByIdMiddleware, singleRouter);

module.exports = router;
