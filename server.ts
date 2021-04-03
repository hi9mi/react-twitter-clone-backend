import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { passport } from './core/passport';
import { registerValidations } from './validations/register';
import { createTweetValidations } from './validations/createTweet';
import { UserCtrl } from './controllers/UserController';
import { TweetsCtrl } from './controllers/TweetsController';
import { UploadFileCtrl } from './controllers/UploadFileController';

const app = express();
// const storage = multer.diskStorage({
// 	destination: function (_, __, cb) {
// 		cb(null, __dirname + '/uploads');
// 	},
// 	filename: function (_, file, cb) {
// 		const ext = file.originalname.split('.').pop();
// 		cb(null, 'image-' + Date.now() + ext);
// 	},
// });
const storage = multer.memoryStorage()
const upload = multer({ storage });

app.use(express.json());
app.use(passport.initialize());

app.get('/users', UserCtrl.index);
app.get('/users/me', passport.authenticate('jwt', { session: false }), UserCtrl.getUserInfo);
app.get('/users/:id', UserCtrl.show);

app.get('/tweets', TweetsCtrl.index);
app.get('/tweets/:id', TweetsCtrl.show);
app.delete('/tweets/:id', passport.authenticate('jwt'), TweetsCtrl.delete);
app.patch('/tweets/:id', passport.authenticate('jwt'), createTweetValidations, TweetsCtrl.update);
app.post('/tweets', passport.authenticate('jwt'), createTweetValidations, TweetsCtrl.create);

app.get('/auth/verify', registerValidations, UserCtrl.verify);
app.post('/auth/register', registerValidations, UserCtrl.create);
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin);

app.post('/upload', upload.single('avatar'), UploadFileCtrl.upload);

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
