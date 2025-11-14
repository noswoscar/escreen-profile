// Simple test configuration
module.exports = {
	baseCommand: 'nyc mocha --exit -r ts-node/register --reporter mochawesome --reporter-options reportDir=../../mocha_reports/escreen-profile',

	// Unit tests
	unit: {
		timeout: 30000,
		patterns: {
			all: './tests/Unit/**/*.test.ts'
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
