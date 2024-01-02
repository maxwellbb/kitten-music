import React from 'react'
import { Box, Heading, Button } from '@chakra-ui/react'

import LandingNavbar from '../components/LandingNavbar'

export default function LandingPage() {

	const onLogin = async () => {
		window.location.href = 'http://localhost:5000/api/auth/discord/login'
	}
	
	return (
		<>
			<LandingNavbar />
			<Box p={8}>
				<div>
					<Heading as="h2" size="xl" mb={4}>
						Welcome!
					</Heading>
					<Button colorScheme="blue" onClick={onLogin}>
						Login with Discord
					</Button>
				</div>
			</Box>
		</>
	)
}
