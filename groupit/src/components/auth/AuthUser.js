import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
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
    const signup = () => history.push('/signup');
    const login = () => history.push('/login')
    return (
        <nav className="authoptions">
            {/* {userData.isloggedin === undefined ? (<></>) : (userData.isloggedin ? (<button onClick={logout}>Log out</button>) :
                (<>
                    <button onClick={login}>Log In</button>
                    <button onClick={signup}>Sign Up</button>
                </>))
            } */}
        </nav>
    )
}


