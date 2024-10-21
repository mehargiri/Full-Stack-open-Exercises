import express from 'express';
import rateLimit from 'express-rate-limit';
import authorRouter from './controllers/authors.js';
import blogRouter from './controllers/blogs.js';
import loginRouter from './controllers/login.js';
import userRouter from './controllers/users.js';
import { PORT } from './util/config.js';
import { connectDB } from './util/db.js';
import { errorHandler } from './util/middleware.js';

const app = express();
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 200,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use(limiter);
app.use(express.json());
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/authors', authorRouter);
app.use('/api/login', loginRouter);

app.use(errorHandler);

export default app;

app.listen(PORT, async () => {
	await connectDB();
	console.info(`Server running at ${PORT}`);
});
