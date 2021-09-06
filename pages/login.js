import { useContext, useEffect, useRef, useState } from "react"
import RegisterUser from "../components/RegisterUser"
import { UserContext, DispatchContext } from "../contexts/contexts"
import { useRouter } from "next/router"
import styles from "../styles/login.module.css"
import Redirect from "../components/Redirect"
import Loader from "../components/Loader"

const Login = () => {
  const dispatch = useContext(DispatchContext)
  const { loggedIn, jwtToken, error } = useContext(UserContext)
  const loginRef = useRef(null)
  const registerRef = useRef(null)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (loggedIn) router.push("/")
  }, [loggedIn])

  const login = async (e) => {
    e.preventDefault()
    setLoading(true)

    const credentials = {
      email: e.target[0].value,
      password: e.target[1].value,
    }
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })
      if (res.status === 200) {
        const jres = await res.json()
        if (jres.user.admin && jres.jwtToken) {
          dispatch({ type: "jwt", payload: jres.jwtToken })
        }
        dispatch({ type: "login", payload: jres.user })
      } else {
        dispatch({
          type: "login_failed",
          payload: "Felaktigt email eller lösenord",
        })
        document.querySelector(
          ".login_login_form_error__1iO4S"
        ).style.visibility = "visible"
      }

      //
    } catch (error) {
      console.log("error: ", error)
    }
    setLoading(false)
  }

  const addAnimation = () => {
    dispatch({ type: "clear_error" })
    loginRef.current.className =
      loginRef.current.className + " " + styles.login_ani
    registerRef.current.className =
      registerRef.current.className + " " + styles.register_ani
  }

  const removeAni = () => {
    dispatch({ type: "clear_error" })
    loginRef.current.className = styles.login_form_section
    registerRef.current.className = styles.register_form_section
  }

  return (
    <>
      {loading && <Loader />}
      {/* { jwtToken 
                ? <Redirect to="/admin" /> 
                : loggedIn 
                    ? <Redirect to="/" /> 
                    : null 
            } */}
      <main className={styles.login_main}>
        <section className={styles.login_container}>
          <section ref={loginRef} className={styles.login_form_section}>
            <h2>Välkommen att logga in</h2>
            <div className={styles.login_form_error}>
              {error && <>Felaktig email eller lösenord</>}
            </div>
            <form className={styles.login_form} onSubmit={(e) => login(e)}>
              <div>
                <label>Email:</label>
                <input type="text" name="emaill" />
              </div>
              <div>
                <label>Lösenord:</label>
                <input type="password" name="passwordd" />
              </div>
              <button
                style={{ width: "6vw", margin: ".6em", marginLeft: "30%" }}
              >
                Logga in
              </button>
            </form>
            <span className={styles.login_register_text} onClick={addAnimation}>
              Har du inget konto? Registrera här.
            </span>
          </section>
          <section ref={registerRef} className={styles.register_form_section}>
            <RegisterUser removeAni={removeAni} />
          </section>
        </section>
      </main>
    </>
  )
}

export default Login
