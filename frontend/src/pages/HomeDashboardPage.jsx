import React from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Box, Heading, List, ListItem, Spinner, Link as ChakraLink } from '@chakra-ui/react'

import Navbar from '../components/Navbar'

export default function HomeDashboardPage({ user, userGuilds }) {
  return (
    <>
      <Navbar user={user} />

      <Box p={8}>
        <Heading as="h2" size="xl" mb={4}>
          Your Discord Servers
        </Heading>
        {userGuilds === null && <Spinner />}
        {userGuilds && userGuilds.commonGuilds.length > 0 ? (
          <List spacing={3}>
            {userGuilds.commonGuilds.map((guild) => (
              <ListItem key={guild.id}>
                <ChakraLink fontSize="lg" as={ReactRouterLink} to={`/room/${guild.id}`}>
                  {guild.name}
                </ChakraLink>
              </ListItem>
            ))}
          </List>
        ) : (
          <></>
        )}
      </Box>
    </>
  )
}