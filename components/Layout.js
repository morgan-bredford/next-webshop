import { useContext } from 'react'
import Head from 'next/head'
import Navbar from "./Navbar"
import { UserContext, DispatchContext } from '../contexts/contexts'
import Loader from './Loader'

const Layout = ({children}) => {
    const userstate = useContext(UserContext)

    return (
        <>
            <Head>
                <title>MB's Webbshop</title>
            </Head>
            <Navbar />
            <main className="main">
                { userstate.loading && <Loader /> }
                {children}
            </main> 
        </>
    );
}
 
export default Layout;