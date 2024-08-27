import express, { Request, Response } from "express";
import diagnosisRouter from "./routes/diagnoses";
import patientRouter from "./routes/patients";

const app = express();
const PORT = 3006;

app.use(express.json());

app.get("/api/ping", (_req: Request, res: Response) => {
	console.info("someone pinged here");
	return res.send("pong");
});

app.use("/api/diagnoses", diagnosisRouter);
app.use("/api/patients", patientRouter);

app.listen(PORT, () => {
	console.info(`Server started at http://localhost:${PORT}`);
});
