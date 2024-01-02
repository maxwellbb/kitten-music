import User from '../../models/userModel.js'

import { client } from '../../discord/client.js'

const getUser = async (req, res) => {
    const user = await User.findById(req.user._id)
    return res.status(200).json(user)
}

const getUserGuilds = async (req, res) => {
    const user = await User.findById(req.user._id)
    const clientGuilds = (await client.guilds.fetch()).map(guild => guild.id)
    const response = await fetch(`${process.env.DISCORD_API_ENDPOINT}/users/@me/guilds`, {
        headers: {
            authorization: `Bearer ${user.accessToken}`,
        },
    })
    const data = await response.json()

    if (!response.ok) {
        return res.status(400).json({
            error: data.error
        })
    }

    const userGuilds = data.filter(guild => guild)
    const commonGuilds = data.filter(guild => clientGuilds.includes(guild.id))
    const addableGuilds = data.filter(guild => guild.permissions & 0x20 && !clientGuilds.includes(guild.id))

    return res.status(200).json({
        commonGuilds,
        userGuilds,
        addableGuilds
    })
}

export {
    getUser,
    getUserGuilds,
}