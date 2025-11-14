import { expect } from 'chai'
import mongoose, { Connection } from 'mongoose'
import MongoDBConnection from '../../../../src/Infra/DB/Connection'

describe('MongoDBConnection', function () {
	let db: MongoDBConnection

	beforeEach(function () {
		// Reset singleton before each test
		;(MongoDBConnection as any).instance = undefined
		db = MongoDBConnection.getInstance()
	})

	afterEach(async function () {
		try {
			const conn = mongoose.connection
			if (conn.readyState === 1) await conn.close()
		} catch (err) {}
	})

	it('should return the same instance (singleton)', function () {
		const instance1 = MongoDBConnection.getInstance()
		const instance2 = MongoDBConnection.getInstance()
		expect(instance1).to.equal(instance2)
	})

	it('should throw if getConnection is called before connect', function () {
		expect(() => db.getConnection()).to.throw('MongoDB connection is not established')
	})

	it('should connect and return a connection', async function () {
		const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/'
		const dbName = process.env.DB_NAME || 'test-db'

		await db.connect()
		const conn: Connection = db.getConnection()

		expect(conn).to.exist
		expect(conn.readyState).to.be.oneOf([1, 2, 3, 4]) // connected, connecting, disconnecting, disconnected
	})

	it('should attach error and open event listeners', async function () {
		await db.connect()
		const conn = db.getConnection()

		// The listeners exist
		const events = conn.eventNames()
		expect(events).to.include.members(['error', 'open'])
	})
})
