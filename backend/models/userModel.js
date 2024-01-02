import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    discordId: {
        type: String,
        required: true,
        unique: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    discordAvatar: {
        type: String,
        required: false
    },
    discordUsername: {
        type: String,
        required: true
    },
    discordGlobalName: {
        type: String,
        required: true
    },
})

const User = mongoose.model('User', userSchema)

export default User