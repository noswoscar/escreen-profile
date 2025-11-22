import { expect } from 'chai'
import { Types } from 'mongoose'
import sinon from 'sinon'
import { ProfileService } from '../../../../../src/App/Services/ProfileService'
import { Profile } from '../../../../../src/Domain/Profile'
import { ProfileRepository } from '../../../../../src/Infra/DB/Repositories/ProfileRepository'

describe('ProfileService - updateProfile', function () {
	let profileRepositoryMock: Partial<ProfileRepository>
	let service: ProfileService
	let existingProfile: Profile
	let userId: string

	beforeEach(function () {
		profileRepositoryMock = {
			findById: sinon.stub(),
			update: sinon.stub()
		}

		service = new ProfileService(profileRepositoryMock as ProfileRepository)

		userId = new Types.ObjectId().toHexString()
		existingProfile = new Profile(new Types.ObjectId(userId), 'user', 'user@test.com')

		// Set initial options
		existingProfile.setAllowsBrowserNotifications(false)
		existingProfile.setAllowsEmailNotifications(false)
		existingProfile.setAllowsSmsNotifications(false)
		existingProfile.setAllowsGeolocation(false)
	})

	it('should update only the provided options and return updated profile', async function () {
		// Mock repository methods
		;(profileRepositoryMock.findById as sinon.SinonStub).resolves(existingProfile)
		;(profileRepositoryMock.update as sinon.SinonStub).resolves(existingProfile)

		const options = {
			allowsBrowserNotifications: true,
			allowsSmsNotifications: true
		}

		const updatedProfile = await service.updateProfile(userId, options)

		sinon.assert.calledOnce(profileRepositoryMock.update as sinon.SinonStub)
		sinon.assert.calledWith(profileRepositoryMock.findById as sinon.SinonStub, sinon.match.instanceOf(Types.ObjectId))

		expect(existingProfile.getAllowsBrowserNotifications()).to.be.true
		expect(existingProfile.getAllowsSmsNotifications()).to.be.true
		expect(existingProfile.getAllowsEmailNotifications()).to.be.false // unchanged
		expect(existingProfile.getAllowsGeolocation()).to.be.false // unchanged

		sinon.assert.calledOnce(profileRepositoryMock.update as sinon.SinonStub)
		sinon.assert.calledWith(profileRepositoryMock.update as sinon.SinonStub, sinon.match.instanceOf(Types.ObjectId), existingProfile)
		expect(updatedProfile).to.equal(existingProfile)
	})

	it('should return null if profile does not exist', async function () {
		// Make sure stub resolves null when called with any ObjectId
		;(profileRepositoryMock.findById as sinon.SinonStub).resolves(null)

		const options = { allowsBrowserNotifications: true }
		const updatedProfile = await service.updateProfile(userId, options)

		// Assert return value
		expect(updatedProfile).to.be.null

		// Assert stub was called once
		sinon.assert.calledOnce(profileRepositoryMock.findById as sinon.SinonStub)
	})

	it('should not change options that are undefined', async function () {
		;(profileRepositoryMock.findById as sinon.SinonStub).resolves(existingProfile)
		;(profileRepositoryMock.update as sinon.SinonStub).resolves(existingProfile)

		const options = {} // no changes
		const updatedProfile = await service.updateProfile(userId, options)

		expect(existingProfile.getAllowsBrowserNotifications()).to.be.false
		expect(existingProfile.getAllowsEmailNotifications()).to.be.false
		expect(existingProfile.getAllowsSmsNotifications()).to.be.false
		expect(existingProfile.getAllowsGeolocation()).to.be.false

		expect(updatedProfile).to.equal(existingProfile)
		sinon.assert.calledOnce(profileRepositoryMock.update as sinon.SinonStub)
	})
})
