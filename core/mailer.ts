import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config()

const options = {
	host: process.env.NODEMAILER_HOST!,
	port: Number(process.env.NODEMAILER_PORT!),
	auth: {
		user: process.env.NODEMAILER_USER!,
		pass: process.env.NODEMAILER_PASS!,
	},
};

export const transport = nodemailer.createTransport(options);
