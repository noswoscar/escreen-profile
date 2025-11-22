import { expect } from 'chai'
import { Types } from 'mongoose'
import sinon from 'sinon'
import { CreateProfileDTO } from '../../../../../src/App/DTOS/CreateProfileDTO'
import { ProfileService } from '../../../../../src/App/Services/ProfileService'
import { Profile } from '../../../../../src/Domain/Profile'
import { ProfileRepository } from '../../../../../src/Infra/DB/Repositories/ProfileRepository'

describe('ProfileService - findOrCreateProfile', function () {
	let repoMock: sinon.SinonStubbedInstance<ProfileRepository>
	let service: ProfileService

	beforeEach(function () {
		repoMock = {
			findById: sinon.stub(),
			findByUsername: sinon.stub(),
			create: sinon.stub(),
			delete: sinon.stub()
		} as unknown as sinon.SinonStubbedInstance<ProfileRepository>

		service = new ProfileService(repoMock)
	})

	const dto: CreateProfileDTO = {
		id: new Types.ObjectId().toHexString(),
		username: 'testuser',
		email: 'test@example.com'
	}

	// ---------------------------------------------------
	// 1. Should return profile when found by ID
	// ---------------------------------------------------
	it('should return an existing profile when found by ID', async function () {
		const existing = new Profile(new Types.ObjectId(dto.id), dto.username, dto.email)

		repoMock.findById.resolves(existing)

		const result = await service.findOrCreateProfile(dto)

		expect(repoMock.findById.calledOnce).to.be.true
		expect(result).to.equal(existing)
	})

	// ---------------------------------------------------
	// 2. Should create profile when not found
	// ---------------------------------------------------
	it('should call createProfile when profile not found', async function () {
		repoMock.findById.resolves(null)

		const created = new Profile(new Types.ObjectId(dto.id), dto.username, dto.email)

		const createProfileSpy = sinon.stub(service, 'createProfile').resolves(created)

		const result = await service.findOrCreateProfile(dto)

		expect(repoMock.findById.calledOnce).to.be.true
		expect(createProfileSpy.calledOnceWith(dto)).to.be.true
		expect(result).to.equal(created)
	})

	// ---------------------------------------------------
	// 3. Missing ID should throw
	// ---------------------------------------------------
	it('should throw if DTO.id is missing', async function () {
		const badDto = {
			username: 'abc',
			email: 'abc@example.com'
		} as any

		try {
			await service.findOrCreateProfile(badDto)
			throw new Error('Expected function to throw')
		} catch (err: any) {
			expect(err.message).to.match(/id is required/)
		}
	})

	// ---------------------------------------------------
	// 4. Missing username should throw
	// ---------------------------------------------------
	it('should throw if DTO.username is missing', async function () {
		const badDto = {
			id: new Types.ObjectId().toHexString(),
			email: 'abc@example.com'
		} as any

		try {
			await service.findOrCreateProfile(badDto)
			throw new Error('Expected function to throw')
		} catch (err: any) {
			expect(err.message).to.match(/username is required/)
		}
	})

	// ---------------------------------------------------
	// 5. Missing email should throw
	// ---------------------------------------------------
	it('should throw if DTO.email is missing', async function () {
		const badDto = {
			id: new Types.ObjectId().toHexString(),
			username: 'abc'
		} as any

		try {
			await service.findOrCreateProfile(badDto)
			throw new Error('Expected function to throw')
		} catch (err: any) {
			expect(err.message).to.match(/email is required/)
		}
	})
})
