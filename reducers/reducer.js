export const reducer = (state, action) => {
  switch (action.type) {
    case "login":
      if (!action.payload.admin) {
        let cart = []
        if (state.cart) cart = state.cart
        localStorage.setItem(
          "user",
          JSON.stringify({ ...action.payload, cart })
        )
      }
      return {
        ...state,
        ...action.payload,
        error: "",
        loggedIn: true,
      }

    case "logout":
      if (localStorage.getItem("user")) localStorage.removeItem("user")
      return {
        email: "",
        firstname: "",
        lastname: "",
        adress: "",
        id: "",
        loggedIn: false,
        admin: false,
        error: "",
        cart: [],
      }

    case "login_failed":
      return {
        ...state,
        error: action.payload,
        loggedIn: false,
      }

    case "set_user":
      if (JSON.parse(localStorage.getItem("user"))) {
        let user = JSON.parse(localStorage.getItem("user"))
        user = { ...user, ...action.payload }
        localStorage.setItem("user", JSON.stringify(user))
      }

      return {
        ...state,
        ...action.payload,
        loggedIn: true,
      }

    case "register_req":
      return {
        ...state,
        isLoading: true,
        error: "",
      }

    case "register_success":
      localStorage.setItem(
        "user",
        JSON.stringify({ ...state, ...action.payload })
      )

      return {
        ...state,
        ...action.payload,
        loggedIn: true,
        isLoading: false,
      }

    case "register_failed":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }

    case "current_product":
      return {
        ...state,
        current_product: action.payload,
      }

    case "current_category":
      return {
        ...state,
        current_category: action.payload,
      }

    case "current_search":
      return {
        ...state,
        current_search: action.payload,
      }

    case "add_to_cart":
      let cart = []
      if (state.cart) cart = [...state.cart]
      const product_exist = cart.find(
        (product) => product._id === action.payload._id
      )
      if (product_exist) {
        product_exist.quantity++
      } else {
        cart.push({ ...action.payload, quantity: 1 })
      }

      if (JSON.parse(localStorage.getItem("user"))) {
        let user = JSON.parse(localStorage.getItem("user"))
        user = { ...user, cart: cart }
        localStorage.setItem("user", JSON.stringify(user))
      }

      return {
        ...state,
        cart: cart,
      }

    case "update_cart":
      const temp_cart = action.payload.filter((pr) => pr.quantity !== 0)

      if (JSON.parse(localStorage.getItem("user"))) {
        let user = JSON.parse(localStorage.getItem("user"))
        user = { ...user, cart: temp_cart }
        localStorage.setItem("user", JSON.stringify(user))
      }

      return {
        ...state,
        cart: temp_cart,
      }

    case "jwt":
      return {
        ...state,
        jwtToken: action.payload,
      }

    case "clear_error":
      return {
        ...state,
        error: "",
      }

    case "loading":
      return {
        ...state,
        loading: action.payload,
      }

    case "test":
      console.log("red test")
      return {
        ...state,
        cart: action.payload,
      }

    default:
      return state
  }
}
