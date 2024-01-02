import { createContext, useReducer, useEffect } from 'react'

export const GuildsContext = createContext()

export const guildsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GUILDS':
      return { userGuilds: action.payload }
    default:
      return state
  }
}

export const GuildsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(guildsReducer, { 
    userGuilds: null
  })

  useEffect(() => {
    const fetchGuilds = async () => {
      const response = await fetch('http://localhost:5000/api/user/@me/guilds', {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
      })
      const json = await response.json()
      
      if (response.ok) {
        localStorage.setItem('userGuilds', JSON.stringify(json))
        dispatch({ type: 'SET_GUILDS', payload: json })
      }
    }

    fetchGuilds()
  }, [])
  
  return (
    <GuildsContext.Provider value={{ ...state, dispatch }}>
      { children }
    </GuildsContext.Provider>
  )
}