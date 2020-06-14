import React, { useState, useContext } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import Axios from 'axios'
import UserContext from '../../UserContext'


export default function Signup() {
    const [Email, setEmail] = useState();
    const [Username, setUsername] = useState();
    const [Password, setPassword] = useState();
    const [name, setName] = useState();
    const [error, setError] = useState();
    const { userData, setUserData } = useContext(UserContext)
    const history = useHistory()
    const submit = async (e) => {
        e.preventDefault();
        const newuser = {
            name: name,
            email: Email,
            username: Username,
            password: Password,
        }
        const userreq = await Axios.post('http://localhost:5000/user/signup', newuser)
        if (userreq.data.name) {
            const loggedinuser = await Axios.post('http://localhost:5000/user/login', {
                email: Email,
                password: Password
            })
            setUserData({
                token: (loggedinuser.data).token,
                user: (loggedinuser.data).user,
                isloggedin: true
            })
            localStorage.setItem('auth-token', (loggedinuser.data).token)
            history.push('/')
        }
        if (userreq.data.msg) {
            setError(userreq.data.msg);
        }


    }
    const login = () => {
        history.push('/login')
    }
    return (<>
        {userData.isloggedin === undefined ? (<></>) :
            (!userData.isloggedin ? (
                <div>
                    <div className='signup-container' id='login-form'>
                        <form onSubmit={submit}>
                            <div className='form-element'>
                                <label>Name</label>
                                <input type='text' id='name' name='name' placeholder='Your Name :)' onChange={e => setName(e.target.value)}></input>
                            </div>
                            <div className='form-element'>
                                <label>Email</label>
                                <input type='email' id='email' name='email' placeholder='Email' onChange={e => setEmail(e.target.value)} ></input>
                            </div>
                            <div className='form-element'>
                                <label>Username</label>
                                <input type='text' id='username' name='username' placeholder='Username' onChange={e => setUsername(e.target.value)}></input>
                            </div>
                            <div className='form-element'>
                                <label>Password</label>
                                <input type='password' id='password' name='password' placeholder='Password (min 5 characters)' onChange={e => setPassword(e.target.value)}></input>
                            </div>
                            <div id='error'>{error ? <>{error}</> : <></>}</div>
                            <div>
                                <input type='submit' value='Register'></input>
                            </div>
                            <h3> Already Have an Account ?</h3>
                            <div>
                                <input type='button' value='LogIn ' onClick={login}></input>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (<Redirect to='/' />))}
    </>
    )

}
