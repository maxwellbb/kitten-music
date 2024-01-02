import express from 'express'
import { getServerQueue, playPauseQueue, skipSong } from '../controllers/roomController.js'

import requireAuth from '../middleware/requireAuth.js'

const router = express.Router()

router.use(requireAuth)

router.get('/:serverId/queue', getServerQueue)

router.post('/:serverId/queue/playPause', playPauseQueue)

router.post('/:serverId/queue/skip', skipSong)

export default router