import 'dotenv/config'
import express from 'express'
import { profileRouter } from './App/Routers/ProfileRouter'
import MongoDBConnection from './Infra/DB/Connection'
import logger from './Infra/Logger/WinstonLogger'

export default class ProfileServer {
	private app: express.Application
	private port: number | string

	constructor() {
		this.app = express()
		this.app.use(express.json())

		this.port = process.env.PORT ?? 3007

		this.setupDatabase()
		this.setupRoutes()
	}

	private setupDatabase(): void {
		MongoDBConnection.getInstance().connect()
	}

	private setupRoutes(): void {
		this.app.use('/api/profile', profileRouter)
		// this.app.use('/', router)
	}

	public startHttpServer(): void {
		this.app.listen(this.port, () => {
			logger.info(`Http server started. Listening on port ${this.port}`)
		})
	}
}
