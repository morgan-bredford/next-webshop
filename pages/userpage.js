import React, { useState, useEffect, useContext, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { UserContext, DispatchContext } from "../contexts/contexts"
import styles from "../styles/userpage.module.css"

const UserPage = () => {
  const { email, firstname, lastname, loggedIn } = useContext(UserContext)
  const dispatch = useContext(DispatchContext)
  const [form, setForm] = useState({})
  const onlyLetters = new RegExp(/^[a-zA-Z-åäöÅÄÖ\@\. ]+$/)
  const router = useRouter()

  //Inserts user info into the page form
  useEffect(() => {
    if (!loggedIn) router.push("/")
    setForm({ email, firstname, lastname })
  }, [])

  const handleChange = (e) => {
    console.log(e.target.value)
    if (onlyLetters.test(e.target.value) || !e.target.value)
      setForm({ ...form, [e.target.name]: e.target.value })
  }

  //Updates the user and saves it
  const submitHandler = (e) => {
    e.preventDefault()

    fetch("/api/users", {
      method: "POST",
      "Content-Type": "application/json",
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((jres) => {
        dispatch({ type: "set_user", payload: jres })
        console.log(jres)
      })
    // axios
    //   .post(URL + "/db/updateuser", form)
    //   .then((res) => {
    //     dispatch({ type: "set_user", payload: form })
    //   })
    //   .catch((err) => {
    //     console.log(err.response.data.message)
    //   })
  }

  const logout = () => {
    dispatch({ type: "logout" })
  }

  return (
    <section className={styles.user_container}>
      <div>
        <form className={styles.user_form} onSubmit={submitHandler}>
          <h2>Redigera dina uppgifter</h2>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            name="email"
            id="email"
            defaultValue={form.email}
            placeholder="email"
            onChange={handleChange}
          />
          <br />

          <label htmlFor="firstname">Förnamn:</label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            defaultValue={form.firstname}
            placeholder="förnamn"
            onChange={handleChange}
          />
          <br />
          <label htmlFor="lastname">Efternamn:</label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            defaultValue={form.lastname}
            placeholder="efternamn"
            onChange={handleChange}
          />
          <br />
          <button className={styles.button}>Uppdatera</button>
        </form>
        <br />
        <Link href="/">
          <a>
            <button onClick={logout}>Logga ut</button>
          </a>
        </Link>
      </div>
    </section>
  )
}

export default UserPage
