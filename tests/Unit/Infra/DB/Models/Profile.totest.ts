import { expect } from 'chai'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

import { IProfile, ProfileModel } from '../../../../../src/Infra/DB/Models/Profile'

describe('ProfileModel (Mongoose Schema)', function () {
	let mongo: MongoMemoryServer

	before(async function () {
		mongo = await MongoMemoryServer.create()
		await mongoose.connect(mongo.getUri())
	})

	after(async function () {
		await mongoose.disconnect()
		await mongo.stop()
	})

	afterEach(async function () {
		await ProfileModel.deleteMany({})
	})

	// ---------------------
	// REQUIRED FIELDS
	// ---------------------
	it('should require id, username, and email', async function () {
		try {
			const profile = new ProfileModel({})
			await profile.save()
			expect.fail('Expected validation error')
		} catch (error: any) {
			expect(error).to.have.property('errors')
			expect(error.errors).to.have.property('id')
			expect(error.errors).to.have.property('username')
			expect(error.errors).to.have.property('email')
		}
	})

	// ---------------------
	// TRIM + LOWERCASE
	// ---------------------
	it('should trim username and convert email to lowercase', async function () {
		const profile = await ProfileModel.create({
			id: '123',
			username: '   JohnDoe   ',
			email: 'ADMIN@EXAMPLE.COM'
		})

		expect(profile.username).to.equal('JohnDoe')
		expect(profile.email).to.equal('admin@example.com')
	})

	// ---------------------
	// DEFAULT OPTIONAL VALUES
	// ---------------------
	it('should apply default values for optional fields', async function () {
		const profile: IProfile = await ProfileModel.create({
			id: 'abc123',
			username: 'testuser',
			email: 'test@example.com'
		})

		expect(profile.age).to.equal(null)
		expect(profile.profileImageUrl).to.equal(null)

		expect(profile.allowsBrowserNotifications).to.be.false
		expect(profile.allowsEmailNotifications).to.be.false
		expect(profile.allowsSmsNotifications).to.be.false
		expect(profile.allowsGeolocation).to.be.false

		expect(profile.createdAt).to.be.instanceOf(Date)
		expect(profile.updatedAt).to.be.instanceOf(Date)
	})

	// ---------------------
	// SAVING OPTIONAL FIELDS
	// ---------------------
	it('should store provided optional fields correctly', async function () {
		const profile = await ProfileModel.create({
			id: 'xyz789',
			username: 'optuser',
			email: 'opt@example.com',
			age: 44,
			profileImageUrl: 'http://image.com/pic.png',
			allowsBrowserNotifications: true,
			allowsEmailNotifications: true,
			allowsSmsNotifications: false,
			allowsGeolocation: true
		})

		expect(profile.age).to.equal(44)
		expect(profile.profileImageUrl).to.equal('http://image.com/pic.png')

		expect(profile.allowsBrowserNotifications).to.be.true
		expect(profile.allowsEmailNotifications).to.be.true
		expect(profile.allowsSmsNotifications).to.be.false
		expect(profile.allowsGeolocation).to.be.true
	})

	// ---------------------
	// UNIQUE ID VALIDATION
	// ---------------------
	it('should not allow duplicate id values', async function () {
		await ProfileModel.create({
			id: 'unique-id',
			username: 'user1',
			email: 'user1@example.com'
		})

		try {
			await ProfileModel.create({
				id: 'unique-id',
				username: 'user2',
				email: 'user2@example.com'
			})
			expect.fail('Expected duplicate key error')
		} catch (error: any) {
			expect(error).to.have.property('code', 11000)
			expect(error.message).to.include('duplicate key error')
		}
	})
})
