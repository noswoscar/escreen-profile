import { expect } from 'chai'
import { ProfileController } from '../../../../src/App/Controllers/ProfileController'
import { Profile } from '../../../../src/Domain/Profile'

describe('ProfileController', function () {
	let profileServiceMock: any
	let controller: ProfileController
	let res: any

	beforeEach(() => {
		profileServiceMock = {
			createProfile: async (dto: any) => {
				// Simulate service validation for required fields
				if (!dto.id) throw new Error('id is required')
				if (!dto.username) throw new Error('username is required')
				if (!dto.email) throw new Error('email is required')
				return new Profile(dto.id, dto.username, dto.email)
			},
			deleteProfile: async (id: string) => true
		}

		controller = new ProfileController(profileServiceMock)

		// Mock res object
		res = {
			status: function (code: number) {
				this.statusCode = code
				return this
			},
			json: function (payload: any) {
				this.payload = payload
				return this
			},
			statusCode: 0,
			payload: null
		}
	})

	describe('createProfile', () => {
		it('should return 201 and created profile when all required fields are present', async () => {
			const req = {
				body: { id: '123', username: 'user1', email: 'user1@example.com' }
			}

			await controller.createProfile(req as any, res)

			expect(res.statusCode).to.equal(201)
			expect(res.payload.message).to.equal('Profile created successfully')
			expect(res.payload.data).to.be.instanceOf(Profile)
			expect(res.payload.data.getUsername()).to.equal('user1')
		})

		it('should return 500 if id is missing', async () => {
			const req = { body: { username: 'user1', email: 'user1@example.com' } }

			await controller.createProfile(req as any, res)

			expect(res.statusCode).to.equal(500)
			expect(res.payload.message).to.equal('Error creating profile')
			expect(res.payload.error).to.equal('id is required')
		})

		it('should return 500 if username is missing', async () => {
			const req = { body: { id: '123', email: 'user1@example.com' } }

			await controller.createProfile(req as any, res)

			expect(res.statusCode).to.equal(500)
			expect(res.payload.message).to.equal('Error creating profile')
			expect(res.payload.error).to.equal('username is required')
		})

		it('should return 500 if email is missing', async () => {
			const req = { body: { id: '123', username: 'user1' } }

			await controller.createProfile(req as any, res)

			expect(res.statusCode).to.equal(500)
			expect(res.payload.message).to.equal('Error creating profile')
			expect(res.payload.error).to.equal('email is required')
		})
	})

	describe('deleteProfile', () => {
		it('should return 200 if deletion succeeds', async () => {
			const req = { params: { id: '123' } }

			await controller.deleteProfile(req as any, res)

			expect(res.statusCode).to.equal(200)
			expect(res.payload.message).to.equal('Profile deleted successfully')
		})

		it('should return 404 if profile not found', async () => {
			profileServiceMock.deleteProfile = async () => false

			const req = { params: { id: 'missing-id' } }

			await controller.deleteProfile(req as any, res)

			expect(res.statusCode).to.equal(404)
			expect(res.payload.message).to.equal('Profile not found')
		})
	})
})
