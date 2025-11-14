import 'dotenv/config'
import express from 'express'
import { profileRouter } from '../App/Routers/ProfileRouter'
import MongoDBConnection from '../Infra/DB/Connection'
import logger from '../Infra/Logger/WinstonLogger'
import router from './Routers/BaseRouter'

class Server {
	private app: express.Application
	private port: number | string

	constructor() {
		this.app = express()
		this.app.use(express.json())

		this.port = process.env.PORT ?? 3007

		this.initializeServer()
	}

	private initializeServer(): void {
		this.setupDatabase()
		this.setupRoutes()
		this.startHttpServer()
	}

	private setupDatabase(): void {
		MongoDBConnection.getInstance().connect()
	}

	private setupRoutes(): void {
		this.app.use('/api', router)
		this.app.use('/api/profile', profileRouter)
	}

	private startHttpServer(): void {
		this.app.listen(this.port, () => {
			logger.info(`Http server started. Listening on port ${this.port}`)
		})
	}
}

export { Server } // Export the class for testing
