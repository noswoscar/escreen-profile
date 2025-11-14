import mongoose, { Document, Model, Schema, Types } from 'mongoose'

// ---------------------------------------------
// INTERFACE
// ---------------------------------------------
export interface IProfile extends Document {
	_id: Types.ObjectId // domain Profile ID
	username: string
	email: string

	age?: number | null
	profileImageUrl?: string | null

	allowsBrowserNotifications: boolean
	allowsEmailNotifications: boolean
	allowsSmsNotifications: boolean
	allowsGeolocation: boolean

	createdAt: Date
	updatedAt: Date
}

// ---------------------------------------------
// SCHEMA
// ---------------------------------------------
const ProfileSchema = new Schema<IProfile>(
	{
		_id: {
			type: Schema.Types.ObjectId, // ✅ use Schema.Types.ObjectId here
			required: true,
			auto: false
		},
		username: { type: String, required: true, trim: true },
		email: { type: String, required: true, trim: true, lowercase: true },
		age: { type: Number, default: null, min: 0 },
		profileImageUrl: { type: String, default: null },
		allowsBrowserNotifications: { type: Boolean, default: false },
		allowsEmailNotifications: { type: Boolean, default: false },
		allowsSmsNotifications: { type: Boolean, default: false },
		allowsGeolocation: { type: Boolean, default: false }
	},
	{
		timestamps: true,
		versionKey: false
	}
)

// ---------------------------------------------
// MODEL
// ---------------------------------------------
export const ProfileModel: Model<IProfile> = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema)
