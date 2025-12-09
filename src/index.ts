import 'dotenv/config'
import logger from './Infra/Logger/WinstonLogger'
import ProfileServer from './ProfileServer'

async function main() {
	try {
		logger.info('🚀 Starting Profile Microservice...')

		const server = new ProfileServer()
		server.startHttpServer()
	} catch (err) {
		logger.error(`❌ Failed to start the server: ${err}`)
		process.exit(1)
	}
}

main()
