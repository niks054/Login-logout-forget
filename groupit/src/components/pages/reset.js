
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Axios from 'axios'
export default class reset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            confirmPassword: '',
            updated: false,
            isLoading: false,
            redirect: false,
            error: false,
            invalidSite: false,
            isLoggedin: undefined

        }
    }
    async componentDidMount() {
        const token = this.props.match.params.token;
        const tokenres = await Axios.post('http://localhost:5000/user/tokenisvalid', {}, { headers: { 'x-auth-token': token } })
        if (localStorage.getItem('auth-token') === token)
            this.setState({ isLoggedin: true })
        else this.setState({ isLoggedin: false })
        if (!tokenres.data) {
            this.setState({ invalidSite: true });
        }
        if (tokenres.data) {
            const user = await Axios.get('http://localhost:5000/user/home', { headers: { 'x-auth-token': token } })
            this.setState({ username: user.data.username })
        }
    }
    submit = async (e) => {
        e.preventDefault();
        this.setState({ isLoading: 'Resetting ....' })
        const resetbody = {
            newpassword: this.state.password,
            passwordRetype: this.state.confirmPassword
        }
        const token = this.props.match.params.token;
        const status = await Axios.post('http://localhost:5000/user/passwordreset', resetbody, { headers: { 'x-auth-token': token } });
        this.setState({ isLoading: false })
        if (status.data.sent) {
            await this.setState({
                updated: 'Your Password has been Successfuly reset'
            })
        }
        if (status.data.msg) {
            await this.setState({
                error: 'There was some error resetting your password'
            })

        }
    }

    setRedirectlogin = () => {
        this.setState({
            redirect: 'login'
        })
    }
    setRedirectsignup = () => {
        this.setState({
            redirect: 'signup'
        })
    }
    login = () => {
        if (this.state.redirect === 'login')
            return <Redirect to='/login' />
    }
    signup = () => {
        if (this.state.redirect === 'signup')
            return <Redirect to='/signup' />
    }

    render() {
        return (<>
            {this.state.isLoggedin === undefined ? (<></>) :
                (!this.state.isLoggedin ?
                    <>
                        <div id='login-form'>
                            <form onSubmit={this.submit}>
                                <h3>{this.state.username}</h3>
                                <div className='form-element'>
                                    <label>New Password</label>
                                    <input type='password' id='password' name='password' placeholder='Password (min 5 characters)' onChange={e => this.setState({ password: e.target.value })}></input>
                                </div>
                                <div className='form-element'>
                                    <label>Re-type Password</label>
                                    <input type='password' id='password' name='password' placeholder='Confirm Password (min 5 characters)' onChange={e => this.setState({ confirmPassword: e.target.value })}></input>
                                </div>

                                <div id='loading'>{this.state.isLoading ? <>{this.state.isLoading}</> : <></>}</div>
                                <div id='success'>{this.state.updated ? <>{this.state.updated}</> : <></>}</div>
                                <div id='error'>{this.state.error ? <>{this.state.error}</> : <></>}</div>
                                <div>
                                    <input type='submit' value='Reset Password '></input>
                                </div>
                                <h3>OR</h3>
                                <div>
                                    {this.login()}
                                    <input type='button' value='LogIn' onClick={this.setRedirectlogin}></input>
                                </div>
                                <div>
                                    {this.signup()}
                                    <input type='button' value='SignUp' onClick={this.setRedirectsignup}></input>
                                </div>


                            </form>


                        </div></>
                    : (<Redirect to='/' />))}
        </>

        )
    }
}
