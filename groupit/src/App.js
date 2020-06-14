import React, { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Signup from './components/pages/Signup'
import Forgot from './components/pages/Forgot'
import Header from './components/layout/header'
import Reset from './components/pages/reset'
import UserContext from './UserContext'
import './style.css'
import './style2.css'
import Axios from 'axios'


export default function App() {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,
        isloggedin: undefined
    })


    useEffect(() => {

        const checklogin = async () => {

            let token = localStorage.getItem('auth-token');
            if (token === null || token === undefined) {
                localStorage.setItem('auth-token', "");
                token = '';
            }
            const tokenres = await Axios.post('http://localhost:5000/user/tokenisvalid', null, { headers: { 'x-auth-token': token } })
            console.log(tokenres.data);
            if (tokenres.data) {
                const user = await Axios.get('http://localhost:5000/user/home', { headers: { 'x-auth-token': token } })

                setUserData({
                    token,
                    user: user.data,
                    isloggedin: true
                })

            }
            else setUserData({ isloggedin: false })

        }
        checklogin()
    }, [])
    return (
        <BrowserRouter>
            <UserContext.Provider value={{ userData, setUserData }}>
                <Header />
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/signup' component={Signup} />
                    <Route exact path='/password/forgot' component={Forgot} />
                    <Route exact path='/password/reset/:token' component={Reset} />
                </Switch>
            </UserContext.Provider>
        </BrowserRouter>
    )
}
