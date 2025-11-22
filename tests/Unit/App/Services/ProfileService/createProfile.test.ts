import { expect } from 'chai'
import { Types } from 'mongoose'
import { CreateProfileDTO } from '../../../../../src/App/DTOS/CreateProfileDTO'
import { ProfileService } from '../../../../../src/App/Services/ProfileService'
import { Profile } from '../../../../../src/Domain/Profile'

describe('ProfileService - createProfile', function () {
	let profileRepositoryMock: any
	let profileService: ProfileService
	let capturedProfile: Profile | null

	beforeEach(function () {
		capturedProfile = null

		profileRepositoryMock = {
			create: function (profile: Profile) {
				capturedProfile = profile // track the profile passed
				return Promise.resolve(profile)
			}
		}

		profileService = new ProfileService(profileRepositoryMock)
	})

	it('should create a profile with required fields only', async function () {
		const dto: CreateProfileDTO = {
			id: new Types.ObjectId().toHexString(),
			username: 'testuser',
			email: 'test@example.com'
		}

		const createdProfile = await profileService.createProfile(dto)

		expect(createdProfile).to.be.instanceOf(Profile)
		expect(createdProfile.getUsername()).to.equal('testuser')
		expect(createdProfile.getEmail()).to.equal('test@example.com')
		expect(createdProfile.getAge()).to.be.undefined
		expect(createdProfile.getProfileImageUrl()).to.be.undefined
		expect(createdProfile.getAllowsBrowserNotifications()).to.be.undefined
		expect(createdProfile.getAllowsEmailNotifications()).to.be.undefined
		expect(createdProfile.getAllowsSmsNotifications()).to.be.undefined
		expect(createdProfile.getAllowsGeolocation()).to.be.undefined
		expect(createdProfile.getId()).to.be.instanceOf(Types.ObjectId)
		expect(capturedProfile).to.equal(createdProfile) // ensure repo.create was called
	})

	it('should create a profile with all optional fields', async function () {
		const dto: CreateProfileDTO = {
			id: new Types.ObjectId().toHexString(),
			username: 'fulluser',
			email: 'full@example.com',
			age: 30,
			profile_image_url: 'http://example.com/avatar.png',
			allows_browser_notifications: true,
			allows_email_notifications: false,
			allows_sms_notifications: true,
			allows_geolocation: false
		}

		const createdProfile = await profileService.createProfile(dto)

		expect(createdProfile.getAge()).to.equal(30)
		expect(createdProfile.getProfileImageUrl()).to.equal('http://example.com/avatar.png')
		expect(createdProfile.getAllowsBrowserNotifications()).to.be.true
		expect(createdProfile.getAllowsEmailNotifications()).to.be.false
		expect(createdProfile.getAllowsSmsNotifications()).to.be.true
		expect(createdProfile.getAllowsGeolocation()).to.be.false
		expect(capturedProfile).to.equal(createdProfile)
		expect(createdProfile.getId()).to.be.instanceOf(Types.ObjectId)
	})

	it('should use provided id if given', async function () {
		const providedId = new Types.ObjectId()
		const dto: CreateProfileDTO = {
			id: providedId.toHexString(),
			username: 'customuser',
			email: 'custom@example.com'
		}

		const createdProfile = await profileService.createProfile(dto)

		expect(createdProfile.getId().toHexString()).to.equal(providedId.toHexString())
		expect(createdProfile.getId()).to.be.instanceOf(Types.ObjectId)
		expect(capturedProfile).to.equal(createdProfile)
	})

	it('should propagate repository errors', async function () {
		const dto: CreateProfileDTO = {
			id: new Types.ObjectId().toHexString(),
			username: 'failuser',
			email: 'fail@example.com'
		}

		profileRepositoryMock.create = () => {
			throw new Error('DB failure')
		}

		try {
			await profileService.createProfile(dto)
			throw new Error('Expected method to throw')
		} catch (err: any) {
			expect(err).to.be.instanceOf(Error)
			expect(err.message).to.equal('DB failure')
		}
	})

	it('should not set optional fields when they are undefined', async function () {
		const dto: CreateProfileDTO = {
			id: new Types.ObjectId().toHexString(),
			username: 'optionaluser',
			email: 'optional@example.com'
			// no optional fields
		}

		const createdProfile = await profileService.createProfile(dto)

		expect(createdProfile.getAge()).to.be.undefined
		expect(createdProfile.getProfileImageUrl()).to.be.undefined
		expect(createdProfile.getAllowsBrowserNotifications()).to.be.undefined
		expect(createdProfile.getAllowsEmailNotifications()).to.be.undefined
		expect(createdProfile.getAllowsSmsNotifications()).to.be.undefined
		expect(createdProfile.getAllowsGeolocation()).to.be.undefined
		expect(capturedProfile).to.equal(createdProfile)
	})

	it('should throw an error if username is missing', async function () {
		const dto = {
			id: new Types.ObjectId().toHexString(),
			email: 'test@example.com'
		}

		try {
			await profileService.createProfile(dto as CreateProfileDTO)
			throw new Error('Expected createProfile to throw')
		} catch (err: any) {
			expect(err).to.be.instanceOf(Error)
			expect(err.message).to.match(/username/)
		}
	})

	it('should throw an error if email is missing', async function () {
		const dto = {
			id: new Types.ObjectId().toHexString(),
			username: 'testuser'
		}

		try {
			await profileService.createProfile(dto as CreateProfileDTO)
			throw new Error('Expected createProfile to throw')
		} catch (err: any) {
			expect(err).to.be.instanceOf(Error)
			expect(err.message).to.match(/email/)
		}
	})
})
