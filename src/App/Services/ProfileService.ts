import { Types } from 'mongoose'
import { Profile } from '../../Domain/Profile'
import { ProfileRepository } from '../../Infra/DB/Repositories/ProfileRepository'

import { CreateProfileDTO } from '../DTO/CreateProfileDTO'

export class ProfileService {
	private profileRepository: ProfileRepository

	constructor(profileRepository: ProfileRepository) {
		this.profileRepository = profileRepository
	}

	// -----------------------------
	// CREATE PROFILE
	// -----------------------------
	createProfile = async (dto: CreateProfileDTO): Promise<Profile> => {
		const id = dto.id ?? new Types.ObjectId().toString()

		const profile = new Profile(id, dto.username, dto.email)

		// Map optional properties
		if (dto.age !== undefined) profile.setAge(dto.age)
		if (dto.profile_image_url !== undefined) profile.setProfileImageUrl(dto.profile_image_url)

		if (dto.allows_browser_notifications !== undefined) profile.setAllowsBrowserNotifications(dto.allows_browser_notifications)

		if (dto.allows_email_notifications !== undefined) profile.setAllowsEmailNotifications(dto.allows_email_notifications)

		if (dto.allows_sms_notifications !== undefined) profile.setAllowsSmsNotifications(dto.allows_sms_notifications)

		if (dto.allows_geolocation !== undefined) profile.setAllowsGeolocation(dto.allows_geolocation)

		return this.profileRepository.create(profile)
	}

	// -----------------------------
	// DELETE PROFILE
	// -----------------------------
	deleteProfile = async (id: string): Promise<boolean> => {
		return this.profileRepository.delete(id)
	}
}
