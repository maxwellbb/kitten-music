import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'

import { AuthContextProvider } from './context/AuthContext.jsx'
import { GuildsContextProvider } from './context/GuildsContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<ChakraProvider>
			<AuthContextProvider>
				<GuildsContextProvider>
					<App />
				</GuildsContextProvider>
			</AuthContextProvider>
		</ChakraProvider>
	</React.StrictMode>,
)
