import { useQueue } from 'discord-player'

const getServerQueue = async (req, res) => {
    const { serverId } = req.params
    
    const queue = useQueue(serverId)

    if (!queue) {
        return res.status(200).json({
            queuedTracks: [],
            currentTrack: null,
            currentDuration: 0,
            currentProgress: 0
        })
    }

    const queuedTracks = queue.tracks.toArray() || null
    const currentTrack = queue.currentTrack || null
    let currentDuration = 0
    let currentProgress = 0

    try {
        currentDuration = queue.node.totalDuration
        currentProgress = queue.node.playbackTime
    } catch (error) {
        currentDuration = 0
        currentProgress = 0
    }

    return res.status(200).json({
        queuedTracks,
        currentTrack,
        currentDuration,
        currentProgress,
        isPaused: queue.node.isPaused()
    })
}

const playPauseQueue = async (req, res) => {
    const { serverId } = req.params
    const queue = useQueue(serverId)

    queue.node.setPaused(!queue.node.isPaused())

    return res.status(200).json({
        isPaused: queue.node.isPaused()
    })
}

const skipSong = async (req, res) => {
    const { serverId } = req.params
    const queue = useQueue(serverId)

    queue.node.skip()

    return res.status(200).json({
        success: true
    })
}

export {
    getServerQueue,
    playPauseQueue,
    skipSong
}