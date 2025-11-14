import { expect } from 'chai'
import { ProfileService } from '../../../../../src/App/Services/ProfileService'

describe('ProfileService - deleteProfile', function () {
	let profileRepositoryMock: any
	let profileService: ProfileService
	let calledWithId: string | null

	beforeEach(function () {
		calledWithId = null

		// Manual mock of ProfileRepository
		profileRepositoryMock = {
			delete: function (id: string) {
				calledWithId = id // capture the id passed
				// Return true if id is 'existing', false otherwise
				return Promise.resolve(id === 'existing')
			}
		}

		profileService = new ProfileService(profileRepositoryMock)
	})

	it('should return true when repository deletes existing profile', async function () {
		const id = 'existing'
		const result = await profileService.deleteProfile(id)

		expect(result).to.be.true
		expect(calledWithId).to.equal(id) // ensure repo.delete was called with correct id
	})

	it('should return false when repository cannot delete profile', async function () {
		const id = 'nonexistent'
		const result = await profileService.deleteProfile(id)

		expect(result).to.be.false
		expect(calledWithId).to.equal(id) // ensure repo.delete was called with correct id
	})
})
