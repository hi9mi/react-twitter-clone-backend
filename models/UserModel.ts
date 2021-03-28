import { Document, model, Schema } from 'mongoose';

export interface UserModelInterface {
	_id?: string
	email: string;
	password: string;
	username: string;
	fullname: string;
	confirmHash: string;
	confirmed?: boolean;
	location?: string;
	about?: string;
	website?: string;
}

export type UserModelDocumentInterface = UserModelInterface & Document;

const UserSchema = new Schema<UserModelDocumentInterface>({
	email: {
		unique: true,
		required: true,
		type: String,
	},
	password: {
		required: true,
		type: String,
	},
	username: {
		unique: true,
		required: true,
		type: String,
	},
	fullname: {
		required: true,
		type: String,
	},
	confirmHash: {
		required: true,
		type: String,
	},
	confirmed: {
		type: Boolean,
		default: false,
	},
	location: String,
	about: String,
	website: String,
});

UserSchema.set('toJSON', {
	transform: function (_: UserModelInterface, obj: UserModelInterface) {
		delete obj.password;
		delete obj.confirmHash;
		return obj;
	},
});

export const UserModel = model<UserModelDocumentInterface>('User', UserSchema);