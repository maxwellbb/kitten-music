import React from 'react'
import { Box, Heading, Text } from '@chakra-ui/react'

const NotFoundPage = () => {
  return (
    <Box textAlign="center" mt="20">
      <Heading fontSize="6xl" color="red.500">
        404
      </Heading>
      <Text fontSize="2xl" fontWeight="bold" mb="4">
        Page Not Found
      </Text>
      <Text fontSize="lg">
        Oops! The page you are looking for might be in another castle.
      </Text>
    </Box>
  )
}

export default NotFoundPage;
