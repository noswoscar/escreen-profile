import { expect } from 'chai'
import sinon from 'sinon'
import { ProfileController } from '../../../../../src/App/Controllers/ProfileController'
import { ProfileService } from '../../../../../src/App/Services/ProfileService'

describe('ProfileController - deleteProfile', function () {
	let profileServiceMock: sinon.SinonStubbedInstance<ProfileService>
	let controller: ProfileController
	let req: any
	let res: any

	beforeEach(function () {
		profileServiceMock = {
			deleteProfile: sinon.stub()
		} as unknown as sinon.SinonStubbedInstance<ProfileService>

		controller = new ProfileController(profileServiceMock)

		req = { params: {} }
		res = {
			status: sinon.stub().returnsThis(),
			json: sinon.stub().returnsThis()
		}
	})

	it('should return 200 when delete succeeds', async function () {
		req.params.id = '123'
		profileServiceMock.deleteProfile.resolves(true)

		await controller.deleteProfile(req, res)

		expect(res.status.calledWith(200)).to.be.true
		expect(res.json.calledOnce).to.be.true
	})

	it('should return 404 when profile not found', async function () {
		req.params.id = '123'
		profileServiceMock.deleteProfile.resolves(false)

		await controller.deleteProfile(req, res)

		expect(res.status.calledWith(404)).to.be.true
		expect(res.json.calledOnce).to.be.true
	})

	it('should return 500 on service error', async function () {
		req.params.id = '123'
		profileServiceMock.deleteProfile.rejects(new Error('fail'))

		await controller.deleteProfile(req, res)

		expect(res.status.calledWith(500)).to.be.true
		expect(res.json.calledOnce).to.be.true
	})
})
