import mongoose, { Document, Schema } from 'mongoose'

// ----- INTERFACE -----
export interface IProfile extends Document {
	id: string
	username: string
	email: string
	age?: number
	profile_image_url?: string
	allows_browser_notifications?: boolean
	allows_email_notifications?: boolean
	allows_sms_notifications?: boolean
	allows_geolocation?: boolean
	createdAt?: Date
	updatedAt?: Date
}

// ----- SCHEMA -----
const ProfileSchema = new Schema<IProfile>(
	{
		id: {
			type: String,
			required: true,
			unique: true
		},
		username: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		age: {
			type: Number,
			default: null
		},
		profile_image_url: {
			type: String,
			default: null
		},
		allows_browser_notifications: {
			type: Boolean,
			default: false
		},
		allows_email_notifications: {
			type: Boolean,
			default: false
		},
		allows_sms_notifications: {
			type: Boolean,
			default: false
		},
		allows_geolocation: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true // createdAt, updatedAt
	}
)

// ----- MODEL -----
export const ProfileModel = mongoose.model<IProfile>('Profile', ProfileSchema)
