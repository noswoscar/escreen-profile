import { expect } from 'chai'
import { Profile } from '../../../src/Domain/Profile'

describe('Profile Entity', function () {
	let profile

	const sampleId = '12345'
	const sampleUsername = 'testuser'
	const sampleEmail = 'test@example.com'

	beforeEach(function () {
		profile = new Profile(sampleId, sampleUsername, sampleEmail)
	})

	// --------------------
	// ID
	// --------------------
	it('should return the correct ID', function () {
		expect(profile.getId()).to.equal(sampleId)
	})

	it('should update the ID', function () {
		const newId = '67890'
		profile.setId(newId)
		expect(profile.getId()).to.equal(newId)
	})

	// --------------------
	// Username
	// --------------------
	it('should return the correct username', function () {
		expect(profile.getUsername()).to.equal(sampleUsername)
	})

	it('should update the username', function () {
		const newUsername = 'updatedUser'
		profile.setUsername(newUsername)
		expect(profile.getUsername()).to.equal(newUsername)
	})

	// --------------------
	// Email
	// --------------------
	it('should return the correct email', function () {
		expect(profile.getEmail()).to.equal(sampleEmail)
	})

	it('should update the email', function () {
		const newEmail = 'new@example.com'
		profile.setEmail(newEmail)
		expect(profile.getEmail()).to.equal(newEmail)
	})

	// --------------------
	// Age
	// --------------------
	it('should return undefined age initially', function () {
		expect(profile.getAge()).to.be.undefined
	})

	it('should update the age', function () {
		const age = 25
		profile.setAge(age)
		expect(profile.getAge()).to.equal(age)
	})

	// --------------------
	// Profile Image URL
	// --------------------
	it('should return undefined profile_image_url initially', function () {
		expect(profile.getProfileImageUrl()).to.be.undefined
	})

	it('should update the profile_image_url', function () {
		const url = 'http://example.com/image.png'
		profile.setProfileImageUrl(url)
		expect(profile.getProfileImageUrl()).to.equal(url)
	})

	// --------------------
	// Browser Notifications
	// --------------------
	it('should return undefined allows_browser_notifications initially', function () {
		expect(profile.getAllowsBrowserNotifications()).to.be.undefined
	})

	it('should update allows_browser_notifications', function () {
		profile.setAllowsBrowserNotifications(true)
		expect(profile.getAllowsBrowserNotifications()).to.be.true
	})

	// --------------------
	// Email Notifications
	// --------------------
	it('should return undefined allows_email_notifications initially', function () {
		expect(profile.getAllowsEmailNotifications()).to.be.undefined
	})

	it('should update allows_email_notifications', function () {
		profile.setAllowsEmailNotifications(true)
		expect(profile.getAllowsEmailNotifications()).to.be.true
	})

	// --------------------
	// SMS Notifications
	// --------------------
	it('should return undefined allows_sms_notifications initially', function () {
		expect(profile.getAllowsSmsNotifications()).to.be.undefined
	})

	it('should update allows_sms_notifications', function () {
		profile.setAllowsSmsNotifications(true)
		expect(profile.getAllowsSmsNotifications()).to.be.true
	})

	// --------------------
	// Geolocation
	// --------------------
	it('should return undefined allows_geolocation initially', function () {
		expect(profile.getAllowsGeolocation()).to.be.undefined
	})

	it('should update allows_geolocation', function () {
		profile.setAllowsGeolocation(true)
		expect(profile.getAllowsGeolocation()).to.be.true
	})
})
