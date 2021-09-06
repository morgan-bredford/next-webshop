import React, { useEffect, useReducer } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import Home from './components/Home';
import Admin from './components/Admin'
import Navbar from './components/Navbar'
import Product from './components/Product'
import RegisterUser from './components/RegisterUser'
import { UserContext, DispatchContext } from './contexts/contexts'
import { reducer } from './reducers/reducer'
import LogIn from './components/LogIn';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './components/Cart';
import Category from './components/Category';
import Search from './components/Search';
import UserPage from './components/UserPage';

function App(state) {
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
  initialUserState = {...initialUserState, ...state.state}
  const [userstate, dispatch] = useReducer(reducer, initialUserState)

  useEffect( () => {
    if(localStorage.getItem('user')){
      const user = JSON.parse(localStorage.getItem('user'))
      initialUserState = { ...initialUserState, ...user }
      dispatch({type: 'set_user', payload: initialUserState })
    } 
  },[])

  return (
    <>
      <DispatchContext.Provider value={dispatch}>
        <UserContext.Provider value={userstate}>
          <Navbar />
          <main className="main" >
            <Switch>
              <Route exact path="/" component={Home} />
              {/* <Route path='/admin' render={ () => userstate.jwtToken ? <Admin /> : <Home /> } /> */}
              <ProtectedRoute path="/admin" component={Admin} /> 
              <Route path="/login" component={LogIn} />
              <Route path="/register" component={RegisterUser} />
              <Route path="/category" component={Category} />
              <Route path="/products/:productId" component={Product} />
              <Route path="/cart" component={Cart} />
              <Route path="/search" component={Search} />
              <Route path="/userpage" component={UserPage} />
              <Redirect to="/" />
            </Switch>
          </main>
        </UserContext.Provider>
      </DispatchContext.Provider>
    </>
  )
}

export default App;
