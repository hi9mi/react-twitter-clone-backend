import { body } from 'express-validator';

export const registerValidations = [
	body('email', 'Введите E-mail')
		.isString()
		.isEmail()
		.withMessage('Неверный E-mail')
		.isLength({
			min: 10,
			max: 40,
		})
		.withMessage('Почта должна содержать от 10 до 40 символов'),

	body('fullname', 'Введите имя')
		.isString()
		.isLength({
			min: 2,
			max: 40,
		})
		.withMessage('Имя должно содержать от 2 до 40 символов'),

	body('username', 'Введите логин')
		.isString()
		.isLength({
			min: 2,
			max: 40,
		})
		.withMessage('Логин должен содержать от 2 до 40 символов'),

	body('password')
		.isLength({ min: 6 })
		.withMessage('Минимальная длина пароля 6 символов')
		.custom((value, { req }) => {
			if (value !== req.body.password2) {
				throw new Error('Пароли не совпадают');
			} else {
				return value;
			}
		}),
];
