import React from 'react'
import { Box, Flex, Divider, VStack, HStack, Link, List, ListItem, Heading, Image, Text } from '@chakra-ui/react'

export default function RoomQueue({ playing, queue }) {
  return (
    <>
      <Heading as="h3" size="lg" mb={4}>
        Now Playing
      </Heading>
      {/* Section for currently playing song */}
      {playing && (
        <HStack alignItems="center" bg="gray.100" p={4} rounded="md">
          <Image
            borderRadius="full"
            boxSize="50px"
            src={playing.thumbnail}
            alt={playing.title}
          />
          <Link mt={2} ml={1}>
            <Heading size="sm">{playing.title}</Heading>
            <Text fontSize="sm" color="gray.500">
              {playing.author}
            </Text>
          </Link>
        </HStack>
      )}

      {/* Divider between sections */}
      <Divider my={4} />
      
      <Heading as="h3" size="lg" mb={4}>
        Queue
      </Heading>
      <Box 
        overflowY="auto"
        minHeight="300px"
        maxHeight='calc(100vh - 550px)'
        maxW='100%'
        borderWidth='1px'
        borderRadius='lg'
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: "gray",
            borderRadius: '24px',
          },
        }}
      >
        {/* List for remaining songs in the queue */}
        <List spacing={3}>
          {queue.map((track, index) => (
            <ListItem key={index}>
              <Box display="flex" alignItems="center">
                <Image
                  borderRadius="full"
                  boxSize="30px"
                  src={track.thumbnail}
                  alt={track.title}
                  mr={2}
                />
                <Link href={track.url} isExternal>
                  {track.title} - {track.author}
                </Link>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  )
}