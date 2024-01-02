import React from 'react'
import { Box, Flex, Avatar, Menu, MenuButton, MenuList, MenuItem, Text } from '@chakra-ui/react'

import { useLogout } from '../hooks/useLogout'
import { Link } from 'react-router-dom'

export default function Navbar({ user }) {
  const { logout } = useLogout()

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
        <Menu>
          <MenuButton as={Avatar} src={user.discordAvatar} cursor="pointer" />
          <MenuList color="black">
            <MenuItem >
              <Link to="/dashboard">My Servers</Link>
            </MenuItem>
            <MenuItem onClick={logout}>
              Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  )
}