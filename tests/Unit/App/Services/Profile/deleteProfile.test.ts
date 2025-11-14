import { expect } from 'chai'
import { Types } from 'mongoose'
import { ProfileService } from '../../../../../src/App/Services/ProfileService'

describe('ProfileService - deleteProfile', function () {
	let profileRepositoryMock: any
	let profileService: ProfileService
	let calledWithId: Types.ObjectId | null

	beforeEach(function () {
		calledWithId = null

		// Manual mock of ProfileRepository
		profileRepositoryMock = {
			delete: function (id: Types.ObjectId) {
				calledWithId = id // capture the id passed
				// Return true if id matches a specific ObjectId, false otherwise
				const existingId = new Types.ObjectId('507f191e810c19729de860ea')
				return Promise.resolve(id.equals(existingId))
			}
		}

		profileService = new ProfileService(profileRepositoryMock)
	})

	it('should return true when repository deletes existing profile', async function () {
		const existingId = new Types.ObjectId('507f191e810c19729de860ea')
		const result = await profileService.deleteProfile(existingId)

		expect(result).to.be.true
		expect(calledWithId?.equals(existingId)).to.be.true
	})

	it('should return false when repository cannot delete profile', async function () {
		const nonExistentId = new Types.ObjectId()
		const result = await profileService.deleteProfile(nonExistentId)

		expect(result).to.be.false
		expect(calledWithId?.equals(nonExistentId)).to.be.true
	})
})
