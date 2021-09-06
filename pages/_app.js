import { useReducer, useEffect } from 'react'
import Router from 'next/router'
import { UserContext, DispatchContext } from '../contexts/contexts'
import { reducer } from '../reducers/reducer'
import Layout from '../components/Layout'
import '../styles/globals.css'
import Loader from '../components/Loader'

function MyApp({ Component, pageProps }) {
  let initialUserState = {
    email: '',
    firstname: '',
    lastname: '',
    adress: '',
    id: '',
    loggedIn: false,
    admin: false,
    cart: []
  }
  const [userstate, dispatch] = useReducer(reducer, initialUserState)

  useEffect( () => {
    if(localStorage.getItem('user')){
        const user = JSON.parse(localStorage.getItem('user'))
        initialUserState = { ...initialUserState, ...user }
        dispatch({type: 'set_user', payload: initialUserState })
      }
      Router.events.on('routeChangeStart', () => {
        dispatch({type: 'loading', payload: true})
      })
      Router.events.on('routeChangeComplete', () => {
        dispatch({type: 'loading', payload: false})
      }) 
      Router.events.on('routeChangeError', () => console.log('loading error'))
  },[])

  

  return (
    <>
      <DispatchContext.Provider value={dispatch}>
        <UserContext.Provider value={userstate}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserContext.Provider>
      </DispatchContext.Provider>
    </>
  )
}

export default MyApp
