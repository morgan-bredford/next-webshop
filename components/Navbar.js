import React, { useContext, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { UserContext, DispatchContext } from "../contexts/contexts"
import Cart from "./Cart"
import Menu from "./Menu"

const Navbar = () => {
  const dispatch = useContext(DispatchContext)
  const { email, loggedIn, cart, jwtToken } = useContext(UserContext)
  const [showCart, setShowCart] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [numOfItemsInCart, setNumOfItemsInCart] = useState(0)
  const onlyLetters = new RegExp(/^[a-zA-Z-åäöÅÄÖ\@\. ]+$/)
  const router = useRouter()

  useEffect(() => {
    let numItems = 0
    cart?.forEach((prod) => {
      numItems = numItems + prod.quantity
    })
    setNumOfItemsInCart(numItems)
  }, [cart])

  useEffect(() => setShowUserDropdown(false), [loggedIn])

  const logout = () => {
    dispatch({ type: "logout" })
    router.push("/")
  }

  const search = (e) => {
    e.preventDefault()
    if (onlyLetters.test(e.target[0].value)) {
      dispatch({ type: "current_search", payload: e.target[0].value })
      router.push(`/search?search=${e.target[0].value}`)
      //router.push("/search")
    } else {
      dispatch({ type: "current_search", payload: "inputerror" })
      router.push(`/search?search=inputerror`)
    }
  }

  const checkAdminStatus = () => {
    if (jwtToken) {
      router.push("/admin")
    } else {
      router.push("/")
    }
  }

  // const addCloseEvent = () => {
  //     document.addEventListener('mousedown', function handler(e){
  //         if( e.target.className !== "menu_sidebar" && e.target.tagName !== 'LI'){
  //             setShowMenu(false)
  //             document.removeEventListener('mousedown', handler)
  //         }
  //     })
  // }

  return (
    <section className="header">
      <nav className="header_bar">
        <ul className="header_ul">
          <div
            className="header_menu"
            onClick={() => {
              setShowMenu(!showMenu)
              //addCloseEvent()
            }}
          >
            <img src="/images/menu.png" className="header_menu_image" />
            <div className="header_menu_text">Meny</div>
          </div>
          <div className="header_logo">
            <Link href="/" className="">
              <a>
                <li className="header_logo_text">mb's webbshop</li>
              </a>
            </Link>
          </div>
          <div className="header_search">
            <form className="header_search_form" onSubmit={(e) => search(e)}>
              <input
                type="text"
                className="header_search_input"
                placeholder="SÖK"
              />
              <button className="header_search_button">
                <img src="/images/search.png" className="header_search_image" />
              </button>
            </form>
          </div>
          {jwtToken && (
            <div className="header_admin" onClick={checkAdminStatus}>
              <li>admin</li>
            </div>
          )}
          <div
            className="header_user"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            {loggedIn ? (
              <>
                <div className="x">
                  <img src="/images/user.png" className="header_user_image" />
                </div>
                <li className="header_user_text">
                  {email}
                  {loggedIn && showUserDropdown && (
                    <span className="header_user_dropdown">
                      <Link href="/userpage">
                        <div className="header_user_dropdown_option">
                          min sida
                        </div>
                      </Link>
                      <hr></hr>
                      <div
                        className="header_user_dropdown_option"
                        onClick={logout}
                      >
                        logga ut
                      </div>
                    </span>
                  )}
                </li>
              </>
            ) : (
              <Link href="/login">
                <a>
                  <img src="/images/user.png" className="header_user_image" />
                  <li className="header_user_text">logga in</li>
                </a>
              </Link>
            )}
          </div>
          <div className="header_cart" onClick={() => setShowCart(!showCart)}>
            <li>
              <img src="/images/cart.png" className="header_cart_image" />
            </li>
            {cart.length ? (
              <span className="header_cart_number">{numOfItemsInCart}</span>
            ) : null}
            <div className="header_cart_cartname">varukorg</div>
          </div>
        </ul>
      </nav>

      {showMenu && (
        <section className="menu_sidebar">
          <Menu setShowMenu={setShowMenu} />
        </section>
      )}
      {showCart && (
        <section className="cart_sidebar">
          <Cart setShowCart={setShowCart} />
        </section>
      )}
    </section>
  )
}

export default Navbar
