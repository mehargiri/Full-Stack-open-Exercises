import express, { Request, Response } from 'express';
import { xss } from 'express-xss-sanitizer';
import diagnosisRouter from './routes/diagnoses';
import patientRouter from './routes/patients';

const app = express();
const PORT = 3006;

app.use(express.json());
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(xss());

app.get('/api/ping', (_req: Request, res: Response) => {
	console.info('someone pinged here');
	return res.send('pong');
});

app.use('/api/diagnoses', diagnosisRouter);
app.use('/api/patients', patientRouter);

app.listen(PORT, () => {
	console.info(`Server started at http://localhost:${PORT}`);
});
