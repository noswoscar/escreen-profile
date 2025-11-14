import mongoose, { Connection, Mongoose } from 'mongoose'
import logger from '../Logger/WinstonLogger'

// MongoDB Connection Class
class MongoDBConnection {
	private static instance: MongoDBConnection
	private connection: Connection | null = null
	private mongoUrl: string
	private dbName: string | undefined = process.env.DB_NAME

	private constructor() {
		this.mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/'
		if (!this.mongoUrl) {
			throw new Error('Please add the MONGO_URL to environment variables')
		}
		this.dbName = process.env.DB_NAME || 'small-microservice'
		if (!this.dbName) {
			throw new Error('Please add the DB_NAME to environment variables')
		}
	}

	// Singleton pattern to ensure only one connection
	public static getInstance(): MongoDBConnection {
		if (!MongoDBConnection.instance) {
			MongoDBConnection.instance = new MongoDBConnection()
		}
		return MongoDBConnection.instance
	}

	// Connect to MongoDB
	public async connect(): Promise<void> {
		try {
			const mongooseInstance: Mongoose = await mongoose.connect(this.mongoUrl, {
				dbName: this.dbName
			})

			this.connection = mongooseInstance.connection

			this.connection.on('error', (err) => {
				logger.error(`MongoDB connection error: ${err.message}`)
				process.exit(1)
			})

			this.connection.once('open', () => {
				logger.info(`Connected to MongoDB: ${this.dbName}`)
			})
		} catch (error) {
			logger.error(`Failed to connect to MongoDB: ${error}`)
			process.exit(1)
		}
	}

	// Get the active connection
	public getConnection(): Connection {
		if (!this.connection) {
			throw new Error('MongoDB connection is not established. Call connect() first.')
		}
		return this.connection
	}
}

// Export a singleton instance
export default MongoDBConnection
