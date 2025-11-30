import 'dotenv/config'
import ProfileServer from './ProfileServer'

async function main() {
	try {
		console.log('🚀 Starting Calendar Microservice...')

		const server = new ProfileServer()
		server.startHttpServer()
	} catch (err) {
		console.error('❌ Failed to start the server:', err)
		process.exit(1)
	}
}

main()
