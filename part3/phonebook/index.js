import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { xss } from 'express-xss-sanitizer';
import morgan from 'morgan';
import { Person } from './models/person.js';

const app = express();
const port = process.env.PORT || 3001;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 200,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Middlewares
app.use(limiter);
app.use(cors());
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(express.json());
app.use(xss());
app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(express.static('dist'));

// Routes
app.get('/api/persons', async (_req, res) => {
	const people = await Person.find({});
	return res.json(people);
});

app.get('/info', (_req, res) => {
	const dateString = new Date().toString();

	const response = `<p>Phonebook has info for ${Person.length} people</p>
  <p>${dateString}</p>`;

	return res.send(response);
});

app.get('/api/persons/:id', async (req, res) => {
	const { id } = req.params;

	const person = await Person.findById(id);

	if (!person) {
		return res.status(404).send('The person does not exist');
	}

	return res.json(person);
});

app.delete('/api/persons/:id', async (req, res, next) => {
	try {
		const { id } = req.params;

		const person = await Person.findById(id).lean();

		if (!person) {
			return res.status(404).send('The person does not exist');
		}

		await Person.deleteOne({ _id: id }).lean();
		return res.status(204).end();
	} catch (error) {
		next(error);
	}
});

app.post('/api/persons', async (req, res, next) => {
	try {
		const { name, number } = req.body;

		if (!name || !number) {
			return res.status(400).json({ error: 'missing name or number' });
		}

		const personExists = await Person.findOne({ name: name }).lean();

		if (personExists) {
			return res.status(400).json({ error: 'name must be unique' });
		}

		const newContact = new Person({
			name,
			number,
		});

		await newContact.save();
		return res.status(201).json(newContact);
	} catch (error) {
		next(error);
	}
});

app.put('/api/persons/:id', async (req, res, next) => {
	try {
		const { name, number } = req.body;

		if (!name || !number) {
			return res.status(400).json({ error: 'missing name or number' });
		}

		const update = {
			name,
			number,
		};

		const updatedPerson = await Person.findByIdAndUpdate(
			req.params.id,
			update,
			{
				new: true,
				runValidators: true,
				context: 'query',
			}
		);
		return res.json(updatedPerson);
	} catch (error) {
		next(error);
	}
});

const unknownEndpoint = (_req, res) => {
	return res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, _req, res, next) => {
	console.error(error.message);

	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' });
	}
	if (error.name === 'ValidationError') {
		const errorMessages = Object.values(error.errors).map(
			(error) => error.message
		);
		return res.status(400).json({ error: errorMessages });
	}

	next(error);
};

app.use(errorHandler);

app.listen(port, () => {
	console.info(`Server started on http://localhost:${port}`);
});
