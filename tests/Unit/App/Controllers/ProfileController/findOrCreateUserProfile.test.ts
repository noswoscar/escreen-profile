import { expect } from 'chai'
import { Types } from 'mongoose'
import sinon from 'sinon'
import { ProfileController } from '../../../../../src/App/Controllers/ProfileController'
import { ProfileService } from '../../../../../src/App/Services/ProfileService'
import { Profile } from '../../../../../src/Domain/Profile'

describe('ProfileController - findOrCreateUserProfile', function () {
	let profileServiceMock: sinon.SinonStubbedInstance<ProfileService>
	let controller: ProfileController
	let req: any
	let res: any

	beforeEach(function () {
		profileServiceMock = {
			findOrCreateProfile: sinon.stub()
		} as unknown as sinon.SinonStubbedInstance<ProfileService>

		controller = new ProfileController(profileServiceMock)

		req = { body: {}, params: {} }
		res = {
			status: sinon.stub().returnsThis(),
			json: sinon.stub().returnsThis()
		}
	})

	it('should return 200 and profile when successful', async function () {
		const id = new Types.ObjectId().toHexString()
		req.params.id = id
		req.body = { username: 'testuser', email: 'test@example.com' }

		const profile = new Profile(new Types.ObjectId(id), 'testuser', 'test@example.com')
		profileServiceMock.findOrCreateProfile.resolves(profile)

		await controller.findOrCreateUserProfile(req, res)

		expect(profileServiceMock.findOrCreateProfile.calledOnce).to.be.true
		expect(res.status.calledWith(200)).to.be.true
		expect(res.json.calledOnce).to.be.true
	})

	it('should return 400 if id param missing', async function () {
		req.body = { username: 'test', email: 'test@example.com' }
		await controller.findOrCreateUserProfile(req, res)
		expect(res.status.calledWith(400)).to.be.true
	})

	it('should return 400 if username missing', async function () {
		req.params.id = '123'
		req.body = { email: 'test@example.com' }
		await controller.findOrCreateUserProfile(req, res)
		expect(res.status.calledWith(400)).to.be.true
	})

	it('should return 400 if email missing', async function () {
		req.params.id = '123'
		req.body = { username: 'testuser' }
		await controller.findOrCreateUserProfile(req, res)
		expect(res.status.calledWith(400)).to.be.true
	})

	it('should return 500 on service error', async function () {
		req.params.id = '123'
		req.body = { username: 'test', email: 'test@example.com' }
		profileServiceMock.findOrCreateProfile.rejects(new Error('fail'))
		await controller.findOrCreateUserProfile(req, res)
		expect(res.status.calledWith(500)).to.be.true
	})
})
