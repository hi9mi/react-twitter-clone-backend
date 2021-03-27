import passport from 'passport';
import { ExtractJwt as ExtractJWT, Strategy as JWTstrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserModel, UserModelInterface } from '../models/UserModel';
import { generateMD5 } from '../utils/generateHash';

interface UserPassportInterface {
	_id?: string;
}

passport.use(
	new LocalStrategy(
		async (username, password, done): Promise<void> => {
			try {
				const user = await UserModel.findOne({ $or: [{ email: username }, { username }] }).exec();

				if (!user) {
					return done(null, false);
				}

				if (user.password === generateMD5(password + process.env.SECRET_KEY)) {
					done(null, user);
				} else {
					done(null, false);
				}
			} catch (e) {
				done(e, false);
			}
		},
	),
);

passport.use(
	new JWTstrategy(
		{
			secretOrKey: process.env.SECRET_KEY,
			jwtFromRequest: ExtractJWT.fromHeader('token'),
		},
		async (payload: { data: UserModelInterface }, done) => {
			try {
				const user = await (await UserModel.findById(payload.data._id)).execPopulate();
				if (user) {
					return done(null, user);
				}

				done(null, false);
			} catch (error) {
				done(error);
			}
		},
	),
);

passport.serializeUser((user: UserPassportInterface, done) => {
	done(null, user?._id);
});

passport.deserializeUser((id, done) => {
	UserModel.findById(id, (err: Error | null, user: UserModelInterface) => {
		done(err, user);
	});
});

export { passport };
