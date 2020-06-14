import React, { useState, useContext } from 'react'
import { useHistory, Redirect } from 'react-router-dom'
import Axios from 'axios'
import UserContext from '../../UserContext'
export default function Forgot() {
    const [Email, setEmail] = useState();
    const [success, setSuccess] = useState();
    const [loading, setLoading] = useState();
    const [error, setError] = useState();
    const { userData } = useContext(UserContext)
    const history = useHistory();


    const submit = async (e) => {
        e.preventDefault();
        setSuccess(undefined);
        setError(undefined);
        setLoading('Sending Email....');
        console.log('gkbiugbpoi');

        const resetEmail = {
            email: Email
        }

        const success = await Axios.post('http://localhost:5000/user/account/reset', resetEmail);
        if (success.data.sent) {
            setLoading(undefined);
            setError(undefined);
            setSuccess(success.data.sent);
        }
        if (success.data.msg) {
            setLoading(undefined);
            setSuccess(undefined)
            setError(success.data.msg);

        }
        if (userData.isloggedin === true) {
            history.push('/')
        }
    }
    const login = () => {
        history.push('/login')
    }
    const signup = () => {
        history.push('/signup')
    }
    return (<>
        {userData.isloggedin === undefined ? (<></>) :
            (!userData.isloggedin ? <>
                <div id='login-form'>
                    <form onSubmit={submit}>
                        <h4> Enter the email using which you opened the account a link for resetting the password shall be sent there </h4>
                        <div className='form-element'>
                            <label>Email</label>
                            <input type='email' id='email' name='email' placeholder='Email' onChange={e => setEmail(e.target.value)} ></input>
                        </div>
                        <div id='loading'>{loading ? <>{loading}</> : <></>}</div>
                        <div id='success'>{success ? <>{success}</> : <></>}</div>
                        <div id='error'>{error ? <>{error}</> : <></>}</div>
                        <div>
                            <input type='submit' value='Send Email'></input>
                        </div>
                        <h3> OR </h3>
                        <div>
                            <input type='button' className='forgot-login' value='Login' onClick={login}></input>
                        </div>

                        <div>
                            <input type='button' className='forgot-signup' value='SignUp' onClick={signup}></input>
                        </div>


                    </form>


                </div></>
                : (<Redirect to='/' />))}
    </>
    )


}
