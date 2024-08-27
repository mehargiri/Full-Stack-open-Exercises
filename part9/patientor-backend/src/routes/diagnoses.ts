import express, { Request, Response } from "express";
import diagnosisService from "../services/diagnosisService";

const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
	return res.send(diagnosisService.getDiagnoses());
});

// router.post("/", (_req: Request, res: Response) => {
// 	return res.send("Saving a diary");
// });

export default router;
