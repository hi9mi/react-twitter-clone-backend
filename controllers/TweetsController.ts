import express from 'express';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';

import { TweetModel, TweetModelDocumentInterface, TweetModelInterface } from '../models/TweetModel';
import { UserModelInterface } from '../models/UserModel';
import { isValidObjectId } from '../utils/isValidObjectId';

class TweetsController {
	async index(_: express.Request, res: express.Response): Promise<void> {
		try {
			const tweets = await TweetModel.find({}).populate('user').sort({ createdAt: '-1' }).exec();

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

			const tweet = await TweetModel.findById(tweetId).populate('user').exec();

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

	async getUserTweets(req: express.Request<TweetModelDocumentInterface>, res: express.Response): Promise<void> {
		try {
			const userId = req.params.id;

			if (!isValidObjectId(userId)) {
				res.status(400).send();
				return;
			}

			const tweet = await TweetModel.find({ user: userId }).populate('user').sort({ createdAt: '-1' }).exec();

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

			if (!user) {
				res.status(404).send();
				return;
			}

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
				images: req.body.images,
				user: user,
			};

			const tweet = await TweetModel.create(data);

			user.tweets.push(tweet._id);

			res.json({
				ststus: 'success',
				data: await tweet.populate('user').execPopulate(),
			});
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

				if (!tweet) {
					res.status(404).send();
					return;
				}
				if (!Types.ObjectId(user._id).equals(new Types.ObjectId(tweet.user._id))) {
					res.status(403).send();
					return;
				}

				tweet.remove();
				res.send();
			}
		} catch (e) {
			res.status(500).json({
				status: 'error',
				message: e,
			});
		}
	}

	async update(req: express.Request, res: express.Response): Promise<void> {
		const user = req.user as UserModelInterface;
		try {
			if (user) {
				const tweetId = req.params.id;

				if (!isValidObjectId(tweetId)) {
					res.status(400).send();
					return;
				}

				const tweet = await TweetModel.findById(tweetId);

				if (!tweet) {
					res.status(404).send();
					return;
				}
				if (!Types.ObjectId(user._id).equals(new Types.ObjectId(tweet.user._id))) {
					res.status(403).send();
					return;
				}

				const text = req.body.text as string;
				tweet.text = text;
				tweet.save();
				res.send();
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
