import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'

import UserContext from '../../UserContext'


export default function Home() {

    const { userData } = useContext(UserContext);
    return (
        <>
            {userData.isloggedin === undefined ? <></> : (userData.isloggedin ?
                <>
                    <div className='home-body'>
                        Home
                    </div>
                </>
                :
                (<Redirect to='/login' />))
            }
        </>
    )
}
