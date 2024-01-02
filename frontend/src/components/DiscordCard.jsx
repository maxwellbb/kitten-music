import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import DiscordCard from './DiscordCard'

export default function DiscordCard() {
    const { logout } = useLogout()
    const { user } = useAuthContext()

    const handleClick = () => {
        logout()
    }

    return (
        <nav className='navbar'>
            <Link to='/'>
                <h1> meow meow music </h1>
            </Link>
            { user && (
                <div>
                  <DiscordCard user_id={user._id}/>
                  <button onClick={handleClick}> Logout </button>
                </div>
            )}

            { !user && (
                <div>
                    <Link to='/login'> Login </Link>
                    <Link to='/signup'> Signup </Link>
                </div>
            )}
        </nav>
    )
}