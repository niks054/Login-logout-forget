import React, { useContext } from 'react'
import { useHistory, Link } from 'react-router-dom'
import UserContext from '../../UserContext'

export default function AuthUser() {
    const { userData, setUserData } = useContext(UserContext);
    const history = useHistory();
    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined,
            isloggedin: false
        })
        localStorage.setItem('auth-token', '')
        history.push('/login')
    }
    const home = () => {
        history.push('/')
    }
    return (
        <>
            {userData.isloggedin === undefined ? (<></>) : (userData.isloggedin ?
                <><nav>
                    <ul class="menu">
                        <li class="logo"><a href="#" onClick={home}>Groupit</a></li>
                        <li class="item"><a href='#' onClick={home}>Home</a></li>
                        <li class="item button"><a href='#' onClick={logout}>Logout</a></li>
                    </ul>
                </nav>
                </>
                :

                (<div id="Header">
                    <Link to='/' className='title'>
                        Welcome to  Groupit!</Link>

                </div>))
            }
        </>

    )
}





