import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import { UserCtrl } from './controllers/UserController';
import { registerValidations } from './validations/register';


const app = express();

app.use(express.json());

app.get('/users', UserCtrl.index);
app.post('/users', registerValidations, UserCtrl.create);
app.get('/users/verify', registerValidations, UserCtrl.verify);
// app.patch('/users', UserCtrl.update);
// app.delete('/users', UserCtrl.delete);

const PORT = process.env.PORT || 8888

async function start(): Promise<void> {
	try {
		await mongoose.connect(process.env.MONGO_URI!, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		app.listen(PORT, (): void => {
			console.log(`App has been start on port ${PORT}...`);
		});
	} catch (e) {
		console.log('Server error', e.message);
		process.exit(1);
	}
}

start();
