import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Heading, Spinner, Flex, Box } from '@chakra-ui/react'

import Navbar from '../components/Navbar'
import RoomQueue from '../components/RoomQueue'
import MusicPlayer from '../components/MusicPlayer'

export default function ServerRoomPage({ user, userGuilds }) {
  const { guildId } = useParams()
  const [guild, setGuild] = useState(null)
  const [queue, setQueue] = useState([])
  const [playing, setPlaying] = useState(null)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(true)

  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (!userGuilds || !userGuilds.commonGuilds) {
      return
    }

    setGuild(userGuilds.commonGuilds.find((guild) => guild.id === guildId))
    setPageLoading(false)

    if (!guild) {
      <Navigate to="/dashboard" />
    }
  }, [userGuilds])

  useEffect(() => {
    if (!guild) {
      return
    }

    const fetchQueue = async () => {
      const response = await fetch(`http://localhost:5000/api/room/${guild.id}/queue`, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
      })
      const data = await response.json()

      if (!response.ok) {
        return
      }

      if (!data.currentTrack) {
        return
      }

      setPlaying(data.currentTrack)
      setQueue(data.queuedTracks)
      setProgress(100 * data.currentProgress / data.currentDuration)
      setIsPaused(data.isPaused)
    }
    
    const interval = setInterval(fetchQueue, 1000)
    return () => clearInterval(interval)
  }, [guild])

  if (pageLoading) {
    return <Spinner className="page-spinner"/>
  }

  return (
    <Flex direction="column" justifyContent="space-between" minHeight="100vh">
      <Box>
        <Navbar user={user} />
        <Heading as="h2" size="xl" mb={4}>
          {guild ? guild.name : null}
        </Heading>
        <Box flexGrow={1}>
          <RoomQueue playing={playing} queue={queue}/>
        </Box>
      </Box>
      <MusicPlayer guild={guild} playing={playing} progress={progress} isPaused={isPaused} setIsPaused={setIsPaused}/>
    </Flex>
  )
}