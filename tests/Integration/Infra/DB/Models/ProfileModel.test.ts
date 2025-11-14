import { expect } from 'chai'
import { Types } from 'mongoose'
import { ProfileModel } from '../../../../../src/Infra/DB/Models/Profile'
import { setupDatabase, teardownDatabase } from '../../../SetupConnection' // adjust path

describe('ProfileModel Integration Test', function () {
	before(async function () {
		await setupDatabase()
	})

	after(async function () {
		await teardownDatabase()
	})

	beforeEach(async function () {
		await ProfileModel.deleteMany({})
	})

	it('should create and retrieve a profile', async function () {
		const id = new Types.ObjectId()
		const created = await ProfileModel.create({
			_id: id,
			username: 'testuser',
			email: 'test@example.com',
			age: 25,
			profileImageUrl: 'http://example.com/avatar.png',
			allowsBrowserNotifications: true,
			allowsEmailNotifications: false,
			allowsSmsNotifications: true,
			allowsGeolocation: false
		})

		expect(created._id.toString()).to.equal(id.toString())
		expect(created.username).to.equal('testuser')
		expect(created.email).to.equal('test@example.com')
		expect(created.age).to.equal(25)
		expect(created.profileImageUrl).to.equal('http://example.com/avatar.png')
		expect(created.allowsBrowserNotifications).to.be.true
		expect(created.allowsEmailNotifications).to.be.false
		expect(created.allowsSmsNotifications).to.be.true
		expect(created.allowsGeolocation).to.be.false

		const found = await ProfileModel.findById(id)
		expect(found).to.not.be.null
		expect(found!.username).to.equal('testuser')
	})

	it('should apply default values for missing optional fields', async function () {
		const id = new Types.ObjectId()
		const created = await ProfileModel.create({
			_id: id,
			username: 'defaultuser',
			email: 'default@example.com'
		})

		expect(created.age).to.be.null
		expect(created.profileImageUrl).to.be.null
		expect(created.allowsBrowserNotifications).to.be.false
		expect(created.allowsEmailNotifications).to.be.false
		expect(created.allowsSmsNotifications).to.be.false
		expect(created.allowsGeolocation).to.be.false
	})

	it('should update a profile', async function () {
		const id = new Types.ObjectId()
		await ProfileModel.create({ _id: id, username: 'olduser', email: 'old@example.com' })

		const updated = await ProfileModel.findByIdAndUpdate(id, { username: 'newuser', allowsBrowserNotifications: true }, { new: true })

		expect(updated).to.not.be.null
		expect(updated!.username).to.equal('newuser')
		expect(updated!.allowsBrowserNotifications).to.be.true
	})

	it('should delete a profile', async function () {
		const id = new Types.ObjectId()
		await ProfileModel.create({ _id: id, username: 'todelete', email: 'del@example.com' })

		const deleted = await ProfileModel.findByIdAndDelete(id)
		expect(deleted).to.not.be.null
		expect(deleted!._id.toString()).to.equal(id.toString())

		const found = await ProfileModel.findById(id)
		expect(found).to.be.null
	})

	it('should return null when profile does not exist', async function () {
		const id = new Types.ObjectId()
		const found = await ProfileModel.findById(id)
		expect(found).to.be.null
	})
})
