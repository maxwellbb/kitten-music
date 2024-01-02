import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()

  const logout = async () => {
    const response = await fetch('http://localhost:5000/api/auth/discord/logout', {
      method: 'DELETE',
      withCredentials: true,
      credentials: 'include',
    })

    if (!response.ok) {
      return
    }

    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
  }

  return { logout }
}