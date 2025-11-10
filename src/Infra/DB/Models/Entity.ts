import mongoose, { Document, Schema } from 'mongoose'

// Define an interface for the entity to specify types in TypeScript
interface IEntity extends Document {
	name: string
	age: number
	isActive: boolean
	joinedAt: Date
	tags: string[]
	preferences: {
		color: string
		size: string
	}
	relatedUser: mongoose.Types.ObjectId // Reference to another document (User, for example)
}

const EntitySchema = new Schema<IEntity>(
	{
		name: {
			type: String,
			required: true
		},
		age: {
			type: Number,
			required: true,
			min: [18, 'Age must be at least 18']
		},
		isActive: {
			type: Boolean,
			default: true
		},
		joinedAt: {
			type: Date,
			default: Date.now
		},
		tags: {
			type: [String],
			default: []
		},
		preferences: {
			color: {
				type: String,
				required: true
			},
			size: {
				type: String,
				required: true
			}
		},
		relatedUser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User' // Reference to the 'User' collection
		}
	},
	{
		timestamps: true // Automatically adds `createdAt` and `updatedAt`
	}
)

// Create the model
const EntityModel = mongoose.model<IEntity>('entities', EntitySchema)

export { EntityModel }
