import React from 'react'
import { Box, Flex, Progress, IconButton, Image, Text } from '@chakra-ui/react'

import { FaPlay, FaPause } from 'react-icons/fa'
import { FaForwardStep, FaBackwardStep, FaShuffle, FaRepeat } from 'react-icons/fa6'

export default function MusicPlayer({ guild, playing, progress, isPaused }) {
  const playPause = async() => {
    console.log('playPause')
    const response = await fetch(`http://localhost:5000/api/room/${guild.id}/queue/playpause`, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
    })
    const data = await response.json()

    if (!response.ok) {
      return
    }
  }

  const skip = async() => {
    await fetch(`http://localhost:5000/api/room/${guild.id}/queue/skip`, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
    })
  }

  return (
    <Box as="footer" bg='gray.800' p={4}>
      <Flex justifyContent="space-between">
        {/* Left section for album art song info */}
        <Box flex="1">
          {playing ? (
            <Flex>
              <Image src={playing.thumbnail} alt="Album art" boxSize='100px'/>
              <Box>
                <Text color="white" fontSize="xl" fontWeight="bold" mt={3} mb={2} ml={5}>
                  {playing.title}
                </Text>
                <Text color="white" fontSize="l" mb={2} ml={5}>
                  {playing.author}
                </Text>
              </Box>
            </Flex>
          ) : (
            <Flex>
              <Box h="100px" w="100px" bg="gray.500" />
              <Box>
                <Box h="15px" w="100px" bg="gray.500" mt={3} mb={2} ml={5}/>
                <Box h="15px" w="100px" bg="gray.500" mb={2} ml={5}/>
              </Box>
            </Flex>
          )}
        </Box>

        {/* Middle section for progress bar and playback controls */}
        <Box flex="2">
          <Progress value={progress}/>
          <Flex mt={4} justifyContent="center">
            {/* <IconButton icon={<FaBackwardStep />} mr={3}/> */}
            {!isPaused ? <IconButton icon={<FaPause onClick={playPause}/>} /> : <IconButton icon={<FaPlay onClick={playPause}/>} />}
            <IconButton icon={<FaForwardStep onClick={skip}/>} ml={3}/>
          </Flex>
        </Box>

        <Box flex="1">
          <Flex mt={4} justifyContent="right">
            <IconButton icon={<FaRepeat />} mr={3}/>
            <IconButton icon={<FaShuffle />} />
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}