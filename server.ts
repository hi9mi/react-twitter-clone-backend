import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import { UserCtrl } from './controllers/UserController';
import { passport } from './core/passport';
import { registerValidations } from './validations/register';


const app = express();

app.use(express.json());
app.use(passport.initialize());

app.get('/users', UserCtrl.index);
app.get('/users/me', passport.authenticate('jwt', { session: false }), UserCtrl.getUserInfo);
app.get('/users/:id', UserCtrl.show);
app.get('/auth/verify', registerValidations, UserCtrl.verify);
app.post('/auth/register', registerValidations, UserCtrl.create);
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin);
// app.patch('/users', UserCtrl.update);
// app.delete('/users', UserCtrl.delete);

const PORT = process.env.PORT || 8888;

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
