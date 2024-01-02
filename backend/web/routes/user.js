import express from 'express'
import { getUser, getUserGuilds } from '../controllers/userController.js'

import requireAuth from '../middleware/requireAuth.js'

const router = express.Router()

router.use(requireAuth)

router.get('/@me', getUser)
router.get('/@me/guilds', getUserGuilds)

export default router