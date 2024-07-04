import cors from "cors";
import express from "express";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3001;

// Data
let data = [
	{
		id: "1",
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: "2",
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: "3",
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

// Middlewares
app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());

// Routes
app.get("/api/persons", (req, res) => {
	return res.json(data);
});

app.get("/info", (req, res) => {
	const dateString = new Date().toString();

	const response = `<p>Phonebook has info for ${data.length} people</p>
  <p>${dateString}</p>`;

	return res.send(response);
});

app.get("/api/persons/:id", (req, res) => {
	const { id } = req.params;

	const person = data.find((person) => person.id === id);

	if (!person) {
		return res.status(404).send("The id does not exist");
	}

	return res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
	const { id } = req.params;

	const person = data.find((person) => person.id === id);

	if (!person) {
		return res.status(404).send("The id does not exist");
	}

	data = data.filter((person) => person.id !== id);
	return res.status(204).end();
});

app.post("/api/persons", (req, res) => {
	const { name, number } = req.body;

	if (!name || !number) {
		return res.status(400).json({ error: "missing name or number" });
	}

	const personExists = data.find((person) => person.name === name);

	if (personExists) {
		return res.status(400).json({ error: "name must be unique" });
	}

	const newContact = {
		id: generateId(),
		name,
		number,
	};

	data = [...data, newContact];

	console.log("Updated data:", data);
	return res.json(newContact);
});

const generateId = () => {
	const maxId =
		data.length > 0 ? Math.max(...data.map((d) => Number(d.id))) : 0;
	return String(maxId + 1);
};

app.listen(port, () => {
	console.info(`Server started on http://localhost:${port}`);
});
