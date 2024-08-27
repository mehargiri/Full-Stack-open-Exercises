import express, { Request, Response } from "express";
import patientService from "../services/patientService";
import { toNewEntry } from "../utils/entry.utils";
import { toNewPatient } from "../utils/patients.utils";

const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
	return res.send(patientService.getPatients());
});

router.get("/:id", (req: Request<{ id: string }>, res: Response) => {
	const { id } = req.params;
	return res.send(patientService.getSinglePatient(id));
});

router.post("/", (req: Request, res: Response) => {
	try {
		const newPatient = toNewPatient(req.body);
		const addedPatient = patientService.addPatient(newPatient);
		return res.status(201).json(addedPatient);
	} catch (error: unknown) {
		let errorMessage = "Something went wrong";
		if (error instanceof Error) {
			errorMessage += ` Error: ${error.message}`;
		}
		return res.status(400).send(errorMessage);
	}
});

router.post("/:id/entries", (req: Request<{ id: string }>, res: Response) => {
	try {
		const { id } = req.params;
		const patient = patientService.getSinglePatient(id);
		if (!patient) return res.status(404).send("patient does not exist");

		const newEntry = toNewEntry(req.body);
		const addedEntry = patientService.addEntry(patient, newEntry);
		return res.status(201).json(addedEntry);
	} catch (error: unknown) {
		let errorMessage = "Something went wrong";
		if (error instanceof Error) {
			errorMessage += ` Error: ${error.message}`;
		}
		return res.status(400).send(errorMessage);
	}
});

export default router;
