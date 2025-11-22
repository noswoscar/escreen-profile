import { Types } from 'mongoose'
import { Profile } from '../../Domain/Profile'
import { ProfileRepository } from '../../Infra/DB/Repositories/ProfileRepository'
import { CreateProfileDTO } from '../DTOS/CreateProfileDTO'

export class ProfileService {
	private profileRepository: ProfileRepository

	constructor(profileRepository: ProfileRepository) {
		this.profileRepository = profileRepository
	}

	// -----------------------------
	// CREATE PROFILE
	// -----------------------------
	createProfile = async (dto: CreateProfileDTO): Promise<Profile> => {
		if (!dto.id) throw new Error('id is required')
		if (!dto.username) throw new Error('username is required')
		if (!dto.email) throw new Error('email is required')

		// Convert string ID from main app service to ObjectId
		const id = new Types.ObjectId(dto.id)

		const profile = new Profile(id, dto.username, dto.email)

		// Map optional properties
		if (dto.age !== undefined) profile.setAge(dto.age)
		if (dto.profile_image_url !== undefined) profile.setProfileImageUrl(dto.profile_image_url)
		if (dto.allows_browser_notifications !== undefined) profile.setAllowsBrowserNotifications(dto.allows_browser_notifications)
		if (dto.allows_email_notifications !== undefined) profile.setAllowsEmailNotifications(dto.allows_email_notifications)
		if (dto.allows_sms_notifications !== undefined) profile.setAllowsSmsNotifications(dto.allows_sms_notifications)
		if (dto.allows_geolocation !== undefined) profile.setAllowsGeolocation(dto.allows_geolocation)
		const result = await this.profileRepository.create(profile)
		return result
	}

	// -----------------------------
	// DELETE PROFILE
	// -----------------------------
	deleteProfile = async (id: string | Types.ObjectId): Promise<boolean> => {
		const objId = typeof id === 'string' ? new Types.ObjectId(id) : id
		return this.profileRepository.delete(objId)
	}

	// -----------------------------
	// FIND OR CREATE PROFILE
	// -----------------------------
	findOrCreateProfile = async (dto: CreateProfileDTO): Promise<Profile> => {
		// Validate required fields
		if (!dto.id) throw new Error('id is required in CreateProfileDTO')
		if (!dto.username) throw new Error('username is required in CreateProfileDTO')
		if (!dto.email) throw new Error('email is required in CreateProfileDTO')

		const objectId = new Types.ObjectId(dto.id)

		// 1. Try finding by ID
		let profile = await this.profileRepository.findById(objectId)

		// optional. If not found by ID, try by username (user might have been created before ID sync)
		// if (!profile) {
		// 	profile = await this.profileRepository.findByUsername(dto.username)
		// }

		// 2. If still not found → create new profile
		if (!profile) {
			profile = await this.createProfile(dto)
		}

		return profile
	}

	// -----------------------------
	// UPDATE PROFILE
	// -----------------------------
	updateProfile = async (
		userId: string,
		options: {
			allowsBrowserNotifications?: boolean
			allowsEmailNotifications?: boolean
			allowsSmsNotifications?: boolean
			allowsGeolocation?: boolean
		}
	): Promise<Profile | null> => {
		const objectId = new Types.ObjectId(userId)
		// 1️⃣ Fetch existing profile entity
		const profile = await this.profileRepository.findById(objectId)
		if (!profile) return null

		// 2️⃣ Update only changed options
		if (options.allowsBrowserNotifications !== undefined) profile.setAllowsBrowserNotifications(options.allowsBrowserNotifications)
		if (options.allowsEmailNotifications !== undefined) profile.setAllowsEmailNotifications(options.allowsEmailNotifications)
		if (options.allowsSmsNotifications !== undefined) profile.setAllowsSmsNotifications(options.allowsSmsNotifications)
		if (options.allowsGeolocation !== undefined) profile.setAllowsGeolocation(options.allowsGeolocation)

		// 3️⃣ Save updated entity
		const updatedProfile = await this.profileRepository.update(objectId, profile)
		return updatedProfile
	}
}
