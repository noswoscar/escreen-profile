import { expect } from 'chai'
import express from 'express'
import { Types } from 'mongoose'
import request from 'supertest'
import { profileRouter } from '../../../../src/App/Routers/ProfileRouter'
import { ProfileModel } from '../../../../src/Infra/DB/Models/Profile'
import { setupDatabase, teardownDatabase } from '../../SetupConnection' // adjust path

describe('ParamValidation', function () {
	const app = express()
	app.use(express.json())
	app.use('/profiles', profileRouter)

	// Start in-memory MongoDB before all tests
	before(async () => {
		await setupDatabase()
	})

	// Clear database before each test
	beforeEach(async () => {
		await ProfileModel.deleteMany({})
	})

	// Disconnect and stop MongoDB after all tests
	after(async () => {
		await teardownDatabase()
	})

	// -----------------------------
	// Validation tests
	// -----------------------------
	it('should return 422 if required fields are missing', async () => {
		const res = await request(app).post('/profiles').send({ username: 'test' }) // missing id & email
		expect(res.status).to.equal(422)
		expect(res.body.status).to.equal('validation failed')
		expect(res.body.error).to.be.an('array')
	})

	// -----------------------------
	// Successful profile creation
	// -----------------------------
	it('should create a profile if all fields are valid', async () => {
		const validId = new Types.ObjectId().toString()
		const res = await request(app).post('/profiles').send({
			id: validId,
			username: 'user',
			email: 'user@example.com',
			profile_image_url: 'http://example.com/avatar.png',
			age: 30,
			allows_browser_notifications: true
		})

		expect(res.status).to.equal(201)
		expect(res.body.data.username).to.equal('user')
		expect(res.body.data.id).to.equal(validId)
		expect(res.body.data.profile_image_url).to.equal('http://example.com/avatar.png')
		expect(res.body.data.age).to.equal(30)
		expect(res.body.data.allows_browser_notifications).to.be.true
	})
})
