import express from 'express';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';

import { TweetModel, TweetModelInterface } from '../models/TweetModel';
import { UserModelInterface } from '../models/UserModel';
import { isValidObjectId } from '../utils/isValidObjectId';

class TweetsController {
	async index(_: express.Request, res: express.Response): Promise<void> {
		try {
			const tweets = await TweetModel.find({}).exec();

			res.json({
				status: 'success',
				data: tweets,
			});
		} catch (e) {
			res.status(500).json({
				status: 'error',
				message: e,
			});
		}
	}

	async show(req: express.Request, res: express.Response): Promise<void> {
		try {
			const tweetId: string = req.params.id as string;

			if (!isValidObjectId(tweetId)) {
				res.status(400).send();
				return;
			}

			const tweet = await TweetModel.findById(tweetId).exec();

			if (!tweet) {
				res.status(404).send();
				return;
			}

			res.json({
				status: 'success',
				data: tweet,
			});
		} catch (e) {
			res.status(500).json({
				status: 'error',
				message: e,
			});
		}
	}

	async create(req: express.Request, res: express.Response): Promise<void> {
		try {
			const user = req.user as UserModelInterface;

			if (user) {
				const errors = validationResult(req);

				if (!errors.isEmpty()) {
					res.status(400).json({
						status: 'error',
						errors: errors.array(),
					});
					return;
				}

				const data: TweetModelInterface = {
					text: req.body.text,
					user: user,
				};

				const tweet = await TweetModel.create(data);

				res.json({
					ststus: 'success',
					data: tweet,
				});
			}
		} catch (e) {
			res.status(500).json({
				status: 'error',
				message: e,
			});
		}
	}

	async delete(req: express.Request, res: express.Response): Promise<void> {
		const user = req.user as UserModelInterface;
		try {
			if (user) {
				const tweetId = req.params.id;

				if (!isValidObjectId(tweetId)) {
					res.status(400).send();
					return;
				}

				const tweet = await TweetModel.findById(tweetId);
				// String(user._id) === String(tweet.user._id)
				if (tweet && Types.ObjectId(user._id).equals(new Types.ObjectId(tweet.user._id))) {
					tweet.remove();
					res.send();
				} else {
					res.status(404).send();
				}
			}
		} catch (e) {
			res.status(500).json({
				status: 'error',
				message: e,
			});
		}
	}
}

export const TweetsCtrl = new TweetsController();
