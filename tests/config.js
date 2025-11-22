// Simple test configuration
const nyc = 'nyc'
const reporter = '--reporter mochawesome --reporter-options reportDir=../../mocha_reports/escreen-profile'

module.exports = {
	baseCommand: 'mocha --exit -r ts-node/register',

	// Unit tests
	unit: {
		timeout: 30000,
		patterns: {
			all: './tests/Unit/**/*.test.ts',
			profilecontroller: './tests/Unit/App/Controllers/ProfileController/*.test.ts',
			profileservice: './tests/Unit/App/Services/ProfileService/*.test.ts'
		}
	},

	// Integration tests
	integration: {
		timeout: 10000,
		patterns: {
			all: './tests/Integration/**/*.test.ts'
		}
	},

	// E2E tests
	e2e: {
		timeout: 60000,
		patterns: {
			all: './tests/E2E/**/*.test.ts'
		}
	}
}
