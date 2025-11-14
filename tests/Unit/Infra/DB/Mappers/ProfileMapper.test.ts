import { expect } from 'chai'
import { Types } from 'mongoose'
import { Profile } from '../../../../../src/Domain/Profile'
import { ProfileMapper } from '../../../../../src/Infra/DB/Mappers/ProfileMapper'
import { ProfileModel } from '../../../../../src/Infra/DB/Models/Profile'

describe('ProfileMapper', function () {
	let mapper: ProfileMapper

	beforeEach(function () {
		mapper = new ProfileMapper()
	})

	describe('toDomain', function () {
		it('should map a Mongoose document with all fields to a Profile', function () {
			const mockDoc: any = {
				_id: new Types.ObjectId(),
				username: 'testuser',
				email: 'test@example.com',
				age: 25,
				profileImageUrl: 'http://example.com/avatar.png',
				allowsBrowserNotifications: true,
				allowsEmailNotifications: false,
				allowsSmsNotifications: true,
				allowsGeolocation: false
			}

			const profile = mapper.toDomain(mockDoc)

			expect(profile).to.be.instanceOf(Profile)
			expect(profile.getId().toString()).to.equal(mockDoc._id.toString())
			expect(profile.getUsername()).to.equal('testuser')
			expect(profile.getEmail()).to.equal('test@example.com')
			expect(profile.getAge()).to.equal(25)
			expect(profile.getProfileImageUrl()).to.equal('http://example.com/avatar.png')
			expect(profile.getAllowsBrowserNotifications()).to.be.true
			expect(profile.getAllowsEmailNotifications()).to.be.false
			expect(profile.getAllowsSmsNotifications()).to.be.true
			expect(profile.getAllowsGeolocation()).to.be.false
		})

		it('should handle missing optional fields', function () {
			const mockDoc: any = {
				_id: new Types.ObjectId(),
				username: 'user2',
				email: 'user2@example.com'
			}

			const profile = mapper.toDomain(mockDoc)

			expect(profile.getAge()).to.be.undefined
			expect(profile.getProfileImageUrl()).to.be.undefined
			expect(profile.getAllowsBrowserNotifications()).to.be.undefined
			expect(profile.getAllowsEmailNotifications()).to.be.undefined
			expect(profile.getAllowsSmsNotifications()).to.be.undefined
			expect(profile.getAllowsGeolocation()).to.be.undefined
		})

		it('should convert _id to ObjectId if it is a string', function () {
			const stringId = new Types.ObjectId().toString()
			const mockDoc: any = {
				_id: stringId,
				username: 'user3',
				email: 'user3@example.com'
			}

			const profile = mapper.toDomain(mockDoc)

			expect(profile.getId().toString()).to.equal(stringId)
		})
	})

	describe('toModel', function () {
		it('should map a Profile to a Mongoose model instance with all fields', function () {
			const profile = new Profile(new Types.ObjectId(), 'testuser', 'test@example.com')
			profile.setAge(30)
			profile.setProfileImageUrl('http://example.com/pic.png')
			profile.setAllowsBrowserNotifications(true)
			profile.setAllowsEmailNotifications(false)
			profile.setAllowsSmsNotifications(true)
			profile.setAllowsGeolocation(false)

			const modelInstance: any = mapper.toModel(profile)

			expect(modelInstance).to.be.instanceOf(ProfileModel)
			expect(modelInstance._id.toString()).to.equal(profile.getId().toString())
			expect(modelInstance.username).to.equal('testuser')
			expect(modelInstance.email).to.equal('test@example.com')
			expect(modelInstance.age).to.equal(30)
			expect(modelInstance.profileImageUrl).to.equal('http://example.com/pic.png')
			expect(modelInstance.allowsBrowserNotifications).to.be.true
			expect(modelInstance.allowsEmailNotifications).to.be.false
			expect(modelInstance.allowsSmsNotifications).to.be.true
			expect(modelInstance.allowsGeolocation).to.be.false
		})

		it('should handle undefined optional fields and apply defaults', function () {
			const profile = new Profile(new Types.ObjectId(), 'user2', 'user2@example.com')
			// optional fields not set

			const modelInstance: any = mapper.toModel(profile)

			// Numbers and strings default to null in schema
			expect(modelInstance.age).to.equal(null)
			expect(modelInstance.profileImageUrl).to.equal(null)

			// Booleans default to false in schema
			expect(modelInstance.allowsBrowserNotifications).to.be.false
			expect(modelInstance.allowsEmailNotifications).to.be.false
			expect(modelInstance.allowsSmsNotifications).to.be.false
			expect(modelInstance.allowsGeolocation).to.be.false
		})
	})
})
