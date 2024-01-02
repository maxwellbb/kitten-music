import express from 'express'
import { authLogin, authRegisterUser, authLogout } from '../controllers/authController.js'

const router = express.Router()

router.get('/discord/login', authLogin)

router.get('/discord/callback', authRegisterUser)

router.delete('/discord/logout', authLogout)

export default router