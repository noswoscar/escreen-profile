import express, { Request, type Response } from 'express'

const router = express.Router()

router.get('/info', (_req: Request, res: Response) => {
	res.send('This is an example microservice code, write anything here !!!')
})

router.get('/*', (req: Request, res: Response) => {
	res.send('Usage is /api/profile')
})

export default router
