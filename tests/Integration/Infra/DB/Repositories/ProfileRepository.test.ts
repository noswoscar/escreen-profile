import { expect } from 'chai'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { Types } from 'mongoose'

import { Profile } from '../../../../../src/Domain/Profile'
import { ProfileModel } from '../../../../../src/Infra/DB/Models/Profile'
import { ProfileRepository } from '../../../../../src/Infra/DB/Repositories/ProfileRepository'

describe('ProfileRepository Integration', function () {
	let mongo: MongoMemoryServer
	let repository: ProfileRepository

	before(async function () {
		mongo = await MongoMemoryServer.create()
		await mongoose.connect(mongo.getUri(), { dbName: 'testdb' })
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
	it('should create and return a Profile', async function () {
		const id = new Types.ObjectId()
		const domainProfile = new Profile(id, 'userA', 'a@example.com')
		domainProfile.setAge(22)
		domainProfile.setAllowsBrowserNotifications(true)

		const created = await repository.create(domainProfile)

		expect(created).to.be.instanceOf(Profile)
		expect(created.getId().toString()).to.equal(id.toString())
		expect(created.getUsername()).to.equal('userA')
		expect(created.getEmail()).to.equal('a@example.com')
		expect(created.getAge()).to.equal(22)
		expect(created.getAllowsBrowserNotifications()).to.be.true

		const stored = await ProfileModel.findById(id)
		expect(stored).to.not.be.null
	})

	// -----------------------------
	// FIND BY ID
	// -----------------------------
	it('should find a Profile by _id', async function () {
		const id = new Types.ObjectId()
		await ProfileModel.create({ _id: id, username: 'findMe', email: 'find@example.com' })

		const found = await repository.findById(id)
		expect(found).to.be.instanceOf(Profile) // now it will return a Profile
		expect(found?.getUsername()).to.equal('findMe')
		expect(found?.getEmail()).to.equal('find@example.com')
	})

	// -----------------------------
	// FIND ALL
	// -----------------------------
	it('should return all profiles', async function () {
		const profile1 = new Profile(new Types.ObjectId(), 'u1', 'u1@example.com')
		const profile2 = new Profile(new Types.ObjectId(), 'u2', 'u2@example.com')
		await repository.create(profile1)
		await repository.create(profile2)

		const profiles = await repository.findAll()
		expect(profiles).to.be.an('array').with.lengthOf(2)
		expect(profiles[0]).to.be.instanceOf(Profile)
		expect(profiles[1]).to.be.instanceOf(Profile)
	})

	// -----------------------------
	// UPDATE
	// -----------------------------
	it('should update an existing profile', async function () {
		const id = new Types.ObjectId()
		const original = new Profile(id, 'oldname', 'old@example.com')
		await repository.create(original)

		const updatedProfile = new Profile(id, 'newname', 'new@example.com')
		updatedProfile.setAllowsEmailNotifications(true)

		const updated = await repository.update(id, updatedProfile)
		expect(updated).to.be.instanceOf(Profile)
		expect(updated?.getUsername()).to.equal('newname')
		expect(updated?.getEmail()).to.equal('new@example.com')
		expect(updated?.getAllowsEmailNotifications()).to.be.true
	})

	// -----------------------------
	// DELETE
	// -----------------------------
	it('should delete a profile by ObjectId', async function () {
		const id = new Types.ObjectId()
		const profile = new Profile(id, 'todelete', 'del@example.com')
		await repository.create(profile)

		const deleted = await repository.delete(id)
		expect(deleted).to.be.true

		const found = await ProfileModel.findById(id)
		expect(found).to.be.null
	})

	it('should return false when deleting non-existent profile', async function () {
		const deleted = await repository.delete(new Types.ObjectId())
		expect(deleted).to.be.false
	})
})
