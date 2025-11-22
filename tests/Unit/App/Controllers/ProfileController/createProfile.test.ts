import { expect } from 'chai'
import { Types } from 'mongoose'
import sinon from 'sinon'
import { ProfileController } from '../../../../../src/App/Controllers/ProfileController'
import { ProfileService } from '../../../../../src/App/Services/ProfileService'
import { Profile } from '../../../../../src/Domain/Profile'

describe('ProfileController - createProfile', function () {
	let profileServiceMock: Partial<ProfileService>
	let controller: ProfileController
	let req: any
	let res: any

	beforeEach(function () {
		// Plain object with stubbed method
		profileServiceMock = {
			createProfile: sinon.stub()
		}

		controller = new ProfileController(profileServiceMock as ProfileService)

		req = { body: {} }
		res = {
			status: sinon.stub().callsFake(function (code) {
				return this
			}),
			json: sinon.stub().callsFake(function (obj) {
				return this
			})
		}
	})

	it('should create a profile and return 201', async function () {
		const dto = {
			id: new Types.ObjectId().toHexString(),
			username: 'testuser',
			email: 'test@example.com'
		}

		const createdProfile = new Profile(new Types.ObjectId(dto.id), dto.username, dto.email)
		req.body = dto
		;(profileServiceMock.createProfile as sinon.SinonStub).resolves(createdProfile)

		await controller.createProfile(req, res)

		// Check that createProfile was called with an object that matches dto fields
		expect(
			(profileServiceMock.createProfile as sinon.SinonStub).calledWithMatch({
				id: dto.id,
				username: dto.username,
				email: dto.email
			})
		).to.be.true

		// Check response
		expect(res.status.calledWith(201)).to.be.true
		expect(res.json.calledOnce).to.be.true
	})

	it('should return 500 on error', async function () {
		req.body = { id: '1', username: 'x', email: 'y@y.com' }
		;(profileServiceMock.createProfile as sinon.SinonStub).rejects(new Error('fail'))

		await controller.createProfile(req, res)

		expect(res.status.calledWith(500)).to.be.true
		expect(res.json.calledOnce).to.be.true
	})
})
