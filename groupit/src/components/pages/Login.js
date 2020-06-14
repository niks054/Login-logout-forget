import React, { useState, useContext } from 'react'
import { useHistory, Redirect, Link } from 'react-router-dom'
import Axios from 'axios'
import UserContext from '../../UserContext'
export default function Login() {
    const [Email, setEmail] = useState();
    const [Password, setPassword] = useState();
    const [error, setError] = useState();
    const { userData, setUserData } = useContext(UserContext)
    const history = useHistory();
    // useEffect(() => {

    //     const check = async () => {
    //         const token = localStorage.getItem('auth-token');
    //         //console.log(token);


    //         const checker = await Axios.post('http://localhost:5000/user/tokenisvalid', null, { headers: { 'x-auth-token': token } })
    //         //console.log(checker.data)


    //         setisloggedin(checker.data)
    //         //console.log(isloggedin);

    //     }
    //     check();




    // }, [isloggedin])


    const submit = async (e) => {
        e.preventDefault();
        const newuser = {
            email: Email,
            password: Password,
        }

        const loggedinuser = await Axios.post('http://localhost:5000/user/login', newuser);
        if (loggedinuser.data.token) {
            await setUserData({
                token: (loggedinuser.data).token,
                user: (loggedinuser.data).user,
                isloggedin: true
            })
            localStorage.setItem('auth-token', (loggedinuser.data.token))

            history.push('/')
        }
        if (loggedinuser.data.msg) {
            setError(loggedinuser.data.msg);

        }

    }
    const signup = () => {
        history.push('/signup')
    }
    return (<>
        {userData.isloggedin === undefined ? (<></>) :
            (!userData.isloggedin ? <>
                <div id='login-form'>
                    <form onSubmit={submit}>
                        <div className='form-element'>
                            <label>Email</label>
                            <input type='email' id='email' name='email' placeholder='Email' onChange={e => setEmail(e.target.value)} ></input>
                        </div>
                        <div className='form-element'>
                            <label>Password</label>
                            <input type='password' id='password' name='password' placeholder='Password (min 5 characters)' onChange={e => setPassword(e.target.value)}></input>
                        </div>
                        <div id='forgot-password'><Link to='/password/forgot' className='title'>Forgot password ?</Link></div>
                        <div id='error'>{error ? <>{error}</> : <></>}</div>
                        <div>
                            <input type='submit' value='LogIn '></input>
                        </div>
                        <h3> Don't Have an Account </h3>
                        <div>
                            <input type='button' value='SignUp' onClick={signup}></input>
                        </div>


                    </form>


                </div></>
                : (<Redirect to='/' />))}
    </>
    )


}
