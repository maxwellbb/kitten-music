import React from 'react'
import { Box, Flex, Button, Text } from '@chakra-ui/react'

export default function LandingNavbar() {

  const onLogin = async () => {
		window.location.href = 'http://localhost:5000/api/auth/discord/login'
	}

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="teal.500"
      color="blue.50"
    >
      <Box>
        <Text fontSize="xl" fontWeight="bold" color="white">
          meow meow music
        </Text>
      </Box>

      <Box>
        <Button colorScheme="blue" onClick={onLogin}>
            Login with Discord
        </Button>
      </Box>
    </Flex>
  )
}