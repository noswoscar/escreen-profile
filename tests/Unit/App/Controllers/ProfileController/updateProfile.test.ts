import { expect } from 'chai'
import { Types } from 'mongoose'
import sinon from 'sinon'
import { ProfileController } from '../../../../../src/App/Controllers/ProfileController'
import { ProfileService } from '../../../../../src/App/Services/ProfileService'
import { Profile } from '../../../../../src/Domain/Profile'

describe('ProfileController - updateUserProfile', function () {
	let profileServiceMock: Partial<ProfileService>
	let controller: ProfileController
	let req: any
	let res: any

	beforeEach(function () {
		profileServiceMock = {
			updateProfile: sinon.stub()
		}

		controller = new ProfileController(profileServiceMock as ProfileService)

		req = {
			params: { id: new Types.ObjectId().toHexString() },
			body: {
				profile: {
					options: {
						allows_browser_notifications: true,
						allows_email_notifications: false,
						allows_sms_notifications: true,
						allows_geolocation: false
					}
				}
			}
		}

		res = {
			status: sinon.stub().callsFake(function (code: number) {
				return this
			}),
			json: sinon.stub().callsFake(function (obj: any) {
				return this
			})
		}
	})

	it('should update profile successfully and return 200', async function () {
		const updatedProfile = new Profile(new Types.ObjectId(), 'user', 'user@test.com')
		updatedProfile.setAllowsBrowserNotifications(true)
		updatedProfile.setAllowsEmailNotifications(false)
		updatedProfile.setAllowsSmsNotifications(true)
		updatedProfile.setAllowsGeolocation(false)
		;(profileServiceMock.updateProfile as sinon.SinonStub).resolves(updatedProfile)

		await controller.updateUserProfile(req, res)

		expect(
			(profileServiceMock.updateProfile as sinon.SinonStub).calledWithMatch(req.params.id, {
				allowsBrowserNotifications: true,
				allowsEmailNotifications: false,
				allowsSmsNotifications: true,
				allowsGeolocation: false
			})
		).to.be.true

		expect(res.status.calledWith(200)).to.be.true
		expect(res.json.calledOnce).to.be.true
	})

	it('should return 400 if profile options are missing', async function () {
		req.body = {} // no profile

		await controller.updateUserProfile(req, res)

		expect(res.status.calledWith(400)).to.be.true
		expect(res.json.calledOnce).to.be.true
	})

	it('should return 404 if profile not found', async function () {
		;(profileServiceMock.updateProfile as sinon.SinonStub).resolves(null)

		await controller.updateUserProfile(req, res)

		expect(res.status.calledWith(404)).to.be.true
		expect(res.json.calledOnce).to.be.true
	})

	it('should return 500 if service throws an error', async function () {
		;(profileServiceMock.updateProfile as sinon.SinonStub).rejects(new Error('DB error'))

		await controller.updateUserProfile(req, res)

		expect(res.status.calledWith(500)).to.be.true
		expect(res.json.calledOnce).to.be.true
	})
})
