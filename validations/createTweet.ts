import { body } from 'express-validator';

export const createTweetValidations = [
	body('text', 'Введите текст твита')
		.isString()
		.isLength({
			min: 1,
			max: 280,
		})
		.withMessage('Максимальное длина твита 280 символов'),
];
