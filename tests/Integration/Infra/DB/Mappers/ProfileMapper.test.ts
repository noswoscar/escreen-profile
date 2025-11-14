import { expect } from 'chai'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { Types } from 'mongoose'
import { Profile } from '../../../../../src/Domain/Profile'
import { ProfileMapper } from '../../../../../src/Infra/DB/Mappers/ProfileMapper'
import { ProfileModel } from '../../../../../src/Infra/DB/Models/Profile'

describe('ProfileMapper Integration', function () {
	let mongo: MongoMemoryServer
	let mapper: ProfileMapper

	before(async function () {
		mongo = await MongoMemoryServer.create()
		await mongoose.connect(mongo.getUri())
		mapper = new ProfileMapper()
	})

	after(async function () {
		await mongoose.disconnect()
		await mongo.stop()
	})

	afterEach(async function () {
		await ProfileModel.deleteMany({})
	})

	it('should save a Profile to MongoDB and retrieve it correctly', async function () {
		// Create a domain profile
		const profileId = new Types.ObjectId()
		const domainProfile = new Profile(profileId, 'testuser', 'test@example.com')
		domainProfile.setAge(30)
		domainProfile.setProfileImageUrl('http://example.com/avatar.png')
		domainProfile.setAllowsBrowserNotifications(true)

		// Convert to Mongoose model and save
		const model = mapper.toModel(domainProfile)
		await model.save()

		// Retrieve from DB
		const savedDoc = await ProfileModel.findById(profileId)
		expect(savedDoc).to.not.be.null

		// Convert back to domain
		const retrievedProfile = mapper.toDomain(savedDoc!)
		expect(retrievedProfile.getId().toString()).to.equal(profileId.toString())
		expect(retrievedProfile.getUsername()).to.equal('testuser')
		expect(retrievedProfile.getEmail()).to.equal('test@example.com')
		expect(retrievedProfile.getAge()).to.equal(30)
		expect(retrievedProfile.getProfileImageUrl()).to.equal('http://example.com/avatar.png')
		expect(retrievedProfile.getAllowsBrowserNotifications()).to.be.true
	})

	it('should apply defaults when optional fields are missing', async function () {
		const profileId = new Types.ObjectId()
		const domainProfile = new Profile(profileId, 'user2', 'user2@example.com')

		const model = mapper.toModel(domainProfile)
		await model.save()

		const savedDoc = await ProfileModel.findById(profileId)
		const retrievedProfile = mapper.toDomain(savedDoc!)

		expect(retrievedProfile.getAge()).to.be.undefined
		expect(retrievedProfile.getProfileImageUrl()).to.be.undefined
		expect(retrievedProfile.getAllowsBrowserNotifications()).to.be.false
		expect(retrievedProfile.getAllowsEmailNotifications()).to.be.false
		expect(retrievedProfile.getAllowsSmsNotifications()).to.be.false
		expect(retrievedProfile.getAllowsGeolocation()).to.be.false
	})
})
