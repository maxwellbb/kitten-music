import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Spinner } from '@chakra-ui/react'

import { useAuthContext } from './hooks/useAuthContext'
import { useGuildsContext } from './hooks/useGuildsContext'

import HomeDashboardPage from './pages/HomeDashboardPage'
import LandingPage from './pages/LandingPage'
import NotFoundPage from './pages/NotFoundPage'
import ServerRoomPage from './pages/ServerRoomPage'

export default function App() {
	const { user, isLoading } = useAuthContext()
	const { userGuilds } = useGuildsContext()

	if (isLoading) {
		return <Spinner className="page-spinner"/>
	}

	return (
			<>
				<div className="App">
					<BrowserRouter>
						<div className="pages">
							<Routes>
								<Route
									path="/"
									element={<LandingPage />}
								/>
								<Route
									path="/dashboard"
									element={user ? <HomeDashboardPage user={user} userGuilds={userGuilds}/> : <Navigate to="/" />}
								/>
								<Route
									path="/room/:guildId"
									element={user ? <ServerRoomPage user={user} userGuilds={userGuilds}/> : <Navigate to="/" />}
								/>
								<Route
									path="*"
									element={<NotFoundPage />}
								/>
							</Routes>
						</div>
					</BrowserRouter>
				</div>
			</>
		)
}