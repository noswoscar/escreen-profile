import { Types } from 'mongoose'
import { Profile } from '../../../Domain/Profile'
import { ProfileModel } from '../Models/Profile'

export class ProfileMapper {
	// Convert Mongoose document -> Domain Profile
	toDomain(savedProfile: any): Profile {
		const id = savedProfile._id instanceof Types.ObjectId ? savedProfile._id.toString() : String(savedProfile._id ?? '')

		const profile = new Profile(id, savedProfile.username, savedProfile.email)

		// Optional fields
		if (savedProfile.age !== undefined) profile.setAge(savedProfile.age)
		if (savedProfile.profile_image_url) profile.setProfileImageUrl(savedProfile.profile_image_url)

		if (savedProfile.allows_browser_notifications !== undefined) profile.setAllowsBrowserNotifications(savedProfile.allows_browser_notifications)

		if (savedProfile.allows_email_notifications !== undefined) profile.setAllowsEmailNotifications(savedProfile.allows_email_notifications)

		if (savedProfile.allows_sms_notifications !== undefined) profile.setAllowsSmsNotifications(savedProfile.allows_sms_notifications)

		if (savedProfile.allows_geolocation !== undefined) profile.setAllowsGeolocation(savedProfile.allows_geolocation)

		return profile
	}

	// Convert Domain Profile -> Mongoose model instance (NOT saved)
	toModel(profile: Profile): any {
		return new ProfileModel({
			id: profile.getId(),
			username: profile.getUsername(),
			email: profile.getEmail(),
			age: profile.getAge(),
			profile_image_url: profile.getProfileImageUrl(),
			allows_browser_notifications: profile.getAllowsBrowserNotifications(),
			allows_email_notifications: profile.getAllowsEmailNotifications(),
			allows_sms_notifications: profile.getAllowsSmsNotifications(),
			allows_geolocation: profile.getAllowsGeolocation()
		})
	}
}
