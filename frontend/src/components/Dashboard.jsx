import React from 'react'
import { Box, Heading, Text } from '@chakra-ui/react'

import { useAuthContext } from '../hooks/useAuthContext'

export default function Dashboard() {
  const { user } = useAuthContext()
  
  return (
    <Box p={8}>
      <Heading as="h2" size="xl" mb={4}>
        Welcome, {user.username}#{user.discriminator}!
      </Heading>
      <Text fontSize="lg">Home page</Text>
    </Box>
  )
}
