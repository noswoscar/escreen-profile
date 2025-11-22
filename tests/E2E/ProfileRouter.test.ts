import { expect } from 'chai'
import express from 'express'
import { Types } from 'mongoose'
import request from 'supertest'
import { profileRouter } from '../../src/App/Routers/ProfileRouter'
import { ProfileModel } from '../../src/Infra/DB/Models/Profile'
import { setupDatabase, teardownDatabase } from './SetupConnection'

describe('Profile Router Integration Tests', function () {
	const app = express()
	app.use(express.json())
	app.use('/profiles', profileRouter)

	before(async () => {
		await setupDatabase()
	})

	beforeEach(async () => {
		await ProfileModel.deleteMany({})
	})

	after(async () => {
		await teardownDatabase()
	})

	// -----------------------------
	// CREATE PROFILE
	// -----------------------------
	describe('POST /profiles', () => {
		it('should return 422 if required fields are missing', async () => {
			const res = await request(app).post('/profiles').send({ username: 'test' })
			expect(res.status).to.equal(422)
			expect(res.body.status).to.equal('validation failed')
			expect(res.body.error).to.be.an('array')
		})

		it('should create a profile with valid data', async () => {
			const validId = new Types.ObjectId().toString()
			const res = await request(app).post('/profiles').send({
				id: validId,
				username: 'user1',
				email: 'user1@example.com',
				profile_image_url: 'http://example.com/avatar.png',
				age: 30,
				allows_browser_notifications: true
			})

			expect(res.status).to.equal(201)
			expect(res.body.data.username).to.equal('user1')
			expect(res.body.data.id).to.equal(validId)
			expect(res.body.data.profile_image_url).to.equal('http://example.com/avatar.png')
			expect(res.body.data.age).to.equal(30)
			expect(res.body.data.allows_browser_notifications).to.be.true
		})
	})

	// -----------------------------
	// FIND OR CREATE PROFILE
	// -----------------------------
	describe('PUT /profiles/:id', () => {
		it('should create profile if not exists', async () => {
			const id = new Types.ObjectId().toString()
			const res = await request(app).put(`/profiles/${id}`).send({ username: 'newuser', email: 'newuser@example.com' })

			expect(res.status).to.equal(200)
			const profile = res.body.profile
			expect(profile.username).to.equal('newuser')
			expect(profile.email).to.equal('newuser@example.com')
		})

		it('should return existing profile if it exists', async () => {
			const id = new Types.ObjectId().toString()
			await request(app).post('/profiles').send({ id, username: 'existuser', email: 'exist@example.com' })

			const res = await request(app).put(`/profiles/${id}`).send({ username: 'existuser', email: 'exist@example.com' })

			expect(res.status).to.equal(200)
			const profile = res.body.profile
			expect(profile.username).to.equal('existuser')
			expect(profile.email).to.equal('exist@example.com')
		})
	})

	// -----------------------------
	// UPDATE PROFILE
	// -----------------------------
	describe('POST /profiles/update/:id', () => {
		it('should update profile options', async () => {
			const id = new Types.ObjectId().toString()
			await request(app).post('/profiles').send({ id, username: 'user2', email: 'user2@example.com' })

			const res = await request(app)
				.post(`/profiles/update/${id}`)
				.send({
					profile: {
						followers: 0,
						options: {
							allows_browser_notifications: true,
							allows_email_notifications: true,
							allows_sms_notifications: false,
							allows_geolocation: true
						}
					}
				})

			expect(res.status).to.equal(200)
			const profile = res.body.profile
			expect(profile.allows_browser_notifications).to.be.true
			expect(profile.allows_email_notifications).to.be.true
			expect(profile.allows_sms_notifications).to.be.false
			expect(profile.allows_geolocation).to.be.true
		})

		it('should return 400 if body missing', async () => {
			const id = new Types.ObjectId().toString()
			const res = await request(app).post(`/profiles/update/${id}`).send({})
			expect(res.status).to.equal(400)
			expect(res.body.message).to.equal('Missing user ID or profile options')
		})
	})

	// -----------------------------
	// DELETE PROFILE
	// -----------------------------
	describe('DELETE /profiles/:id', () => {
		it('should delete an existing profile', async () => {
			const id = new Types.ObjectId().toString()
			await request(app).post('/profiles').send({ id, username: 'todelete', email: 'todelete@example.com' })

			const res = await request(app).delete(`/profiles/${id}`)
			expect(res.status).to.equal(200)
			expect(res.body.message).to.equal('Profile deleted successfully')
		})

		it('should return 404 if profile does not exist', async () => {
			const res = await request(app).delete(`/profiles/${new Types.ObjectId().toString()}`)
			expect(res.status).to.equal(404)
			expect(res.body.message).to.equal('Profile not found')
		})
	})
})
