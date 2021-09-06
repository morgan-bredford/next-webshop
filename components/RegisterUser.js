import React, { useState, useContext } from "react"
import { UserContext, DispatchContext } from "../contexts/contexts"
import Loader from "./Loader"

const RegisterUser = ({ removeAni }) => {
  const dispatch = useContext(DispatchContext)
  const { error, isLoading } = useContext(UserContext)
  const [user, setUser] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  })
  const onlyLetters = new RegExp(/^[a-zA-Z-åäöÅÄÖ\@\. ]+$/)
  const [formError, setFormError] = useState("")

  const changeHandler = ({ name, value }) => {
    setUser({ ...user, [name]: value })
  }

  const validateForm = () => {
    if (user.email && user.password) {
      if (
        !onlyLetters.test(user.email) ||
        !onlyLetters.test(user.password) ||
        (user.firstname && !onlyLetters.test(user.firstname)) ||
        (user.lastname && !onlyLetters.test(user.lastname))
      ) {
        setFormError("Vänligen använd bara bokstäver")
        return false
      } else {
        return true
      }
    } else {
      setFormError("Vänligen fyll i både email och lösenord")
      return false
    }
  }

  const addUser = async (e) => {
    e.preventDefault()
    dispatch({ type: "clear_error" })

    if (validateForm()) {
      dispatch({ type: "register_req" })

      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        })
        const jres = await res.json()
        if (res.status === 200) {
          if (jres.admin && jres.jwtToken) {
            dispatch({ type: "jwt", payload: jres.jwtToken })
          }
          dispatch({ type: "login", payload: jres })
        } else {
          if (jres.name === "MongoError" && jres.code === 11000) {
            dispatch({
              type: "register_failed",
              payload: "Kontot finns redan",
            })
          } else {
            dispatch({
              type: "register_failed",
              payload: "Kontot gick ej att registrera",
            })
          }
        }
      } catch (error) {
        console.log("error: ", error)
      }
    }
  }

  return (
    <section>
      {isLoading && <Loader />}
      <h3 className="register_h3">Registrera här</h3>
      <div className="register_error">
        {error}
        {formError}
      </div>
      {/* <div className="form_error_display"></div> */}
      <form className="register_form" onSubmit={(e) => addUser(e)}>
        <label>Email:</label>
        <input
          type="text"
          name="email"
          onChange={(e) => changeHandler(e.target)}
        />
        <br />
        <label>Lösenord:</label>
        <input
          type="password"
          name="password"
          onChange={(e) => changeHandler(e.target)}
        />
        <br />
        <label>Förnamn:</label>
        <input
          type="text"
          name="firstname"
          onChange={(e) => changeHandler(e.target)}
        />
        <br />
        <label>Efternamn:</label>
        <input
          type="text"
          name="lastname"
          onChange={(e) => changeHandler(e.target)}
        />
        <br />
        <button style={{ margin: ".6em", marginLeft: "30%" }}>
          Registrera
        </button>
      </form>
      <span className="register_login_text" onClick={() => removeAni()}>
        Har du redan konto? Logga in här.
      </span>
    </section>
  )
}

export default RegisterUser
