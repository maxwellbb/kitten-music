import User from '../../models/userModel.js'
import generateToken from '../utils/generateToken.js'

const redirect_uri = `${process.env.BASE_URL}/api/auth/discord/callback`
const redirect = encodeURIComponent(redirect_uri)

const authLogin = async (req, res, next) => {
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    res.cookie('discordOAuthState', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // sameSite: 'strict',
    })
    res.redirect(`${process.env.DISCORD_API_ENDPOINT}/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=identify+email+guilds&response_type=code&redirect_uri=${redirect}&prompt=consent&state=${state}`)
    next()
}

const authRegisterUser = async (req, res) => {
    const { state, code } = req.query
    const storedState = req.cookies ? req.cookies.discordOAuthState : null

    res.clearCookie('discordOAuthState')

    if (state === null || state !== storedState) {
        return res.redirect('/?error=state_mismatch')
    }

    if (!code) {
        return next()
    }

    const response = await fetch(`${process.env.DISCORD_API_ENDPOINT}/oauth2/token`,
        {   
            method: 'POST',
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirect_uri,
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
    
    const json = await response.json()

    if (json.error) {
        return res.redirect(`/?error=${json.error}`)
    }

    const accessToken = json.access_token
    const refreshToken = json.refresh_token
    const user = await fetch(`${process.env.DISCORD_API_ENDPOINT}/users/@me`, {
        headers: {
            authorization: `Bearer ${accessToken}`,
        },
    })

    const userData = await user.json()
    
    const userDoc = await User.findOneAndUpdate(
        { discordId: userData.id },
        { email: userData.email, accessToken: accessToken, refreshToken: refreshToken, discordAvatar: userData.avatar, discordUsername: userData.username, discordGlobalName: userData.global_name },
        { new: true, upsert: true } 
    )

    generateToken(res, userDoc._id)

    return res.redirect('http://localhost:5173/dashboard')
}

const authLogout = async (req, res) => {
    res.clearCookie('meowjwt')
    res.status(200).json({ message: 'logged out' })
}

export {
    authLogin,
    authRegisterUser,
    authLogout,
}