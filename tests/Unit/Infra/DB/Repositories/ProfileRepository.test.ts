import { expect } from 'chai'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { Types } from 'mongoose'

import { Profile } from '../../../../../src/Domain/Profile'
import { ProfileModel } from '../../../../../src/Infra/DB/Models/Profile'
import { ProfileRepository } from '../../../../../src/Infra/DB/Repositories/ProfileRepository'

describe('ProfileRepository', function () {
	let mongo: MongoMemoryServer
	let repository: ProfileRepository

	before(async function () {
		mongo = await MongoMemoryServer.create()
		await mongoose.connect(mongo.getUri())
	})

	after(async function () {
		await mongoose.disconnect()
		await mongo.stop()
	})

	beforeEach(async function () {
		repository = new ProfileRepository()
		await ProfileModel.deleteMany({})
	})

	// -----------------------------
	// CREATE
	// -----------------------------
	it('should create and return a Profile domain object', async function () {
		const id = new Types.ObjectId()
		const profile = new Profile(id, 'userA', 'a@example.com')
		profile.setAge(22)

		const created = await repository.create(profile)

		expect(created).to.be.instanceOf(Profile)
		expect(created.getId().toString()).to.equal(id.toString())
		expect(created.getUsername()).to.equal('userA')
		expect(created.getEmail()).to.equal('a@example.com')
		expect(created.getAge()).to.equal(22)
		expect(created.getProfileImageUrl()).to.be.undefined
		expect(created.getAllowsBrowserNotifications()).to.be.false
		expect(created.getAllowsEmailNotifications()).to.be.false
		expect(created.getAllowsSmsNotifications()).to.be.false
		expect(created.getAllowsGeolocation()).to.be.false

		const stored = await ProfileModel.findById(id)
		expect(stored).to.not.be.null
		expect(stored?._id.toString()).to.equal(id.toString())
	})

	// -----------------------------
	// FIND BY ID
	// -----------------------------
	it('should find a Profile by id', async function () {
		const id = new Types.ObjectId()
		await ProfileModel.create({
			_id: id,
			username: 'findMe',
			email: 'find@example.com'
		})

		const result = await repository.findById(id)

		expect(result).to.be.instanceOf(Profile)
		expect(result?.getId().toString()).to.equal(id.toString())
		expect(result?.getUsername()).to.equal('findMe')
		expect(result?.getEmail()).to.equal('find@example.com')
	})

	it('should return null when profile is not found', async function () {
		const result = await repository.findById(new Types.ObjectId())
		expect(result).to.be.null
	})

	// -----------------------------
	// FIND ALL
	// -----------------------------
	it('should return all profiles', async function () {
		const id1 = new Types.ObjectId()
		const id2 = new Types.ObjectId()
		await ProfileModel.create([
			{ _id: id1, username: 'u1', email: 'u1@example.com' },
			{ _id: id2, username: 'u2', email: 'u2@example.com' }
		])

		const profiles = await repository.findAll()

		expect(profiles).to.be.an('array').with.lengthOf(2)
		expect(profiles[0]).to.be.instanceOf(Profile)
		expect(profiles[1]).to.be.instanceOf(Profile)
		expect([profiles[0].getId().toString(), profiles[1].getId().toString()]).to.include.members([id1.toString(), id2.toString()])
	})

	// -----------------------------
	// UPDATE
	// -----------------------------
	it('should update an existing profile', async function () {
		const id = new Types.ObjectId()
		await ProfileModel.create({
			_id: id,
			username: 'oldname',
			email: 'old@example.com'
		})

		const updatedDomain = new Profile(id, 'newname', 'new@example.com')
		updatedDomain.setAllowsBrowserNotifications(true)

		const updated = await repository.update(id, updatedDomain)

		expect(updated).to.be.instanceOf(Profile)
		expect(updated?.getUsername()).to.equal('newname')
		expect(updated?.getEmail()).to.equal('new@example.com')
		expect(updated?.getAllowsBrowserNotifications()).to.be.true

		const stored = await ProfileModel.findById(id)
		expect(stored?.username).to.equal('newname')
	})

	it('should return null when updating non-existing profile', async function () {
		const fakeId = new Types.ObjectId()
		const fake = new Profile(fakeId, 'nobody', 'none@example.com')
		const result = await repository.update(fakeId, fake)
		expect(result).to.be.null
	})

	/////////////////DELETE//////////////////
	it('should delete a profile and return true', async function () {
		const id = new Types.ObjectId()
		await ProfileModel.create({
			_id: id,
			username: 'todelete',
			email: 'del@example.com'
		})

		// Pass the ObjectId directly
		const result = await repository.delete(id)
		expect(result).to.be.true

		const count = await ProfileModel.countDocuments({ _id: id })
		expect(count).to.equal(0)
	})

	it('should return false when deleting non-existing profile', async function () {
		const fakeId = new Types.ObjectId()
		const result = await repository.delete(fakeId)
		expect(result).to.be.false
	})
})
