import { createContext, useReducer, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    default:
      return state
  }
}

const logUserOut = async () => {
  await fetch('http://localhost:5000/api/auth/discord/logout', {
    method: 'DELETE',
    withCredentials: true,
    credentials: 'include',
  })
  localStorage.removeItem('user')
}

export const AuthContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [state, dispatch] = useReducer(authReducer, { 
    user: JSON.parse(localStorage.getItem('user')) || null
  })

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('http://localhost:5000/api/user/@me', {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
      })

      const json = await response.json()
      const user = JSON.parse(localStorage.getItem('user'))
      
      if (!response.ok || (user && user.id !== json.id)) {
        logUserOut()
        dispatch({ type: 'LOGOUT' })

        setIsLoading(false)
        return
      }
  
      localStorage.setItem('user', JSON.stringify(json))
      dispatch({type: 'LOGIN', payload: json})
      setIsLoading(false)
    }

    fetchUser()
  }, [])
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch, isLoading }}>
      { children }
    </AuthContext.Provider>
  )
}