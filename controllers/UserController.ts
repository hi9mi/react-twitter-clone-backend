import express from 'express';
import { validationResult } from 'express-validator';
import { UserModel, UserModelInterface } from '../models/UserModel';
import { generateMD5 } from '../utils/generateHash';
import { sentEmail } from '../utils/sentEmail';

class UserController {
	async index(_: express.Request, res: express.Response): Promise<void> {
		try {
			const users = await UserModel.find({}).exec();

			res.json({
				status: 'success',
				data: users,
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
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.status(400).json({
					status: 'error',
					errors: errors.array(),
				});
				return;
			}

			const data: UserModelInterface = {
				email: req.body.email,
				username: req.body.username,
				fullname: req.body.fullname,
				password: req.body.password,
				confirmHash: generateMD5(process.env.SECRET_KEY!),
			};

			const user = await UserModel.create(data);

			sentEmail(
				{
					emailFrom: 'admin@twitter.com',
					emailTo: data.email,
					subject: 'Подтверждение почты Twitter Clone',
					html: `Для того, чтобы подтвердить почту, перейдите <a href="http://localhost:${
						process.env.PORT || 8888
					}/users/verify?hash=${data.confirmHash}">по этой ссылке</a>`,
				},
				(err: Error | null) => {
					if (err) {
						res.status(500).json({
							status: 'error',
							message: err,
						});
					} else {
						res.status(201).json({
							status: 'succes',
							data: user,
						});
					}
				},
			);
		} catch (e) {
			res.status(500).json({
				status: 'error',
				message: e,
			});
		}
	}

	async verify(req: express.Request, res: express.Response): Promise<void> {
		try {
			const hash: string = req.query.hash as string;

			if (!hash) {
				res.status(400).send();
				return;
			}

			const user = await UserModel.findOne({ confirmHash: hash }).exec();

			if (user) {
				user.confirmed = true;
				user.save();

				res.json({
					status: 'success',
				});
			} else {
				res.status(404).json({
          status: "error",
          message: "Пользователь не найден"
        });
			}
		} catch (e) {
			res.status(500).json({
				status: 'error',
				message: e,
			});
		}
	}
}

export const UserCtrl = new UserController();
