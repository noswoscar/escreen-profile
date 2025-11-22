import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongoServer: MongoMemoryServer

export const setupDatabase = async () => {
	mongoServer = await MongoMemoryServer.create()
	await mongoose.connect(mongoServer.getUri())
}

export const teardownDatabase = async () => {
	await mongoose.disconnect()
	await mongoServer.stop()
}
