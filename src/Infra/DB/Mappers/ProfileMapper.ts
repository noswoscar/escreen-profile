import { Types } from 'mongoose'
import { Profile } from '../../../Domain/Profile'
import { IProfile, ProfileModel } from '../Models/Profile'

export class ProfileMapper {
	// Convert Mongoose document -> Domain Profile
	toDomain(savedProfile: any): Profile {
		const id = savedProfile._id instanceof Types.ObjectId ? savedProfile._id.toString() : String(savedProfile._id ?? '')

		const profile = new Profile(id, savedProfile.username, savedProfile.email)

		// Optional fields
		if (savedProfile.age !== undefined && savedProfile.age !== null) {
			profile.setAge(savedProfile.age)
		}

		if (savedProfile.profileImageUrl !== undefined && savedProfile.profileImageUrl !== null) {
			profile.setProfileImageUrl(savedProfile.profileImageUrl)
		}

		if (savedProfile.allowsBrowserNotifications !== undefined) {
			profile.setAllowsBrowserNotifications(savedProfile.allowsBrowserNotifications)
		}

		if (savedProfile.allowsEmailNotifications !== undefined) {
			profile.setAllowsEmailNotifications(savedProfile.allowsEmailNotifications)
		}

		if (savedProfile.allowsSmsNotifications !== undefined) {
			profile.setAllowsSmsNotifications(savedProfile.allowsSmsNotifications)
		}

		if (savedProfile.allowsGeolocation !== undefined) {
			profile.setAllowsGeolocation(savedProfile.allowsGeolocation)
		}

		return profile
	}

	// Convert Domain Profile -> Mongoose model instance
	toModel(profile: Profile): IProfile {
		const modelData: Partial<IProfile> = {
			_id: profile.getId(),
			username: profile.getUsername(),
			email: profile.getEmail(),
			age: profile.getAge() ?? null,
			profileImageUrl: profile.getProfileImageUrl() ?? null,
			allowsBrowserNotifications: profile.getAllowsBrowserNotifications() ?? false,
			allowsEmailNotifications: profile.getAllowsEmailNotifications() ?? false,
			allowsSmsNotifications: profile.getAllowsSmsNotifications() ?? false,
			allowsGeolocation: profile.getAllowsGeolocation() ?? false
		}

		return new ProfileModel(modelData)
	}
}
