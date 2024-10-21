import express from 'express';
import { xss } from 'express-xss-sanitizer';
import diaryRouter from './routes/diaries';

const app = express();
app.use(express.json());
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(xss());

const PORT = 3000;

app.get('/ping', (_req, res) => {
	console.log('someone pinged here');
	res.send('pong');
});

app.use('/api/diaries', diaryRouter);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
