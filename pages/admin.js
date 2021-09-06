import React, { useEffect, useState, useContext } from "react"
import Link from "next/link"
import { UserContext, DispatchContext } from "../contexts/contexts"

const Admin = () => {
  const dispatch = useContext(DispatchContext)
  const { jwtToken } = useContext(UserContext)
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [product, setProduct] = useState({
    name: "",
    category: "",
    seller: "",
    description: "",
    image: "",
    price: "",
    quantity: "",
  })

  const changeHandler = (change) => {
    setProduct({ ...product, ...change })
  }

  // const addProduct = () => {
  //     axios
  //     .post( URL + "/graphql", {
  //         query : `
  //         mutation {
  //             addProduct(
  //                 name: "${product.name}",
  //                 category: "${product.category}",
  //                 seller: "${product.seller}",
  //                 price: ${product.price},
  //                 quantity: ${product.quantity},
  //                 image: "${product.image}",
  //                 description: "${product.description}",
  //                 jwtToken: "${jwtToken}"
  //             )
  //                 {
  //                     name,
  //                     category,
  //                     seller,
  //                     price,
  //                     quantity,
  //                     image,
  //                     description
  //                 }
  //             }`
  //     })
  //     .then((res) => console.log(res.data) )
  // }

  // const updateProduct = () => {
  //     axios
  //     .post( URL + "/db/updateproduct", {product, jwtToken: jwtToken})
  //     .then((res) => { getProducts() } )
  // }

  // const removeProduct = (id) => {
  //     axios
  //         .post( URL + "/db/removeproduct", {id, jwtToken: jwtToken})
  //         .then((res) => { getProducts() })
  // }

  // const getProducts = () => {
  //     axios
  //         .post( URL + "/db/getproducts", {jwtToken: jwtToken})
  //         .then((res) => {
  //             setProducts(res.data)
  //         })
  // }

  // const getUsers = () => {
  //     axios
  //         .post( URL + "/db/getusers", {jwtToken: jwtToken})
  //         .then((res) => {
  //             setUsers(res.data)
  //         })
  // }

  // const removeUser = (id) => {
  //     axios
  //         .post( URL + "/db/removeuser", {id, jwtToken: jwtToken})
  //         .then((res) => { getUsers() })
  // }

  const userForm = () => {
    return (
      <form>
        namn:
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={(e) => changeHandler({ name: e.target.value })}
        />
        <br />
        kategori:
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={(e) => changeHandler({ category: e.target.value })}
        />
        <br />
        säljare:
        <input
          type="text"
          name="seller"
          value={product.seller}
          onChange={(e) => changeHandler({ seller: e.target.value })}
        />
        <br />
        bild:
        <input
          type="text"
          name="image"
          value={product.image}
          onChange={(e) => changeHandler({ image: e.target.value })}
        />
        <br />
        pris:
        <input
          type="text"
          name="price"
          value={product.price}
          onChange={(e) => changeHandler({ price: e.target.value })}
        />
        <br />
        antal:
        <input
          type="text"
          name="quantity"
          value={product.quantity}
          onChange={(e) => changeHandler({ quantity: e.target.value })}
        />
        <br />
        beskrivning:
        <textarea
          name="description"
          value={product.description}
          onChange={(e) => changeHandler({ description: e.target.value })}
        />
        <br />
      </form>
    )
  }

  const addProduct = async () => {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(product),
    })
    const jres = await res.json()
    console.log(jres)
  }

  return (
    <>
      {showModal && (
        <section className="modal">
          {userForm()}
          {/* <button onClick={updateProduct}>Uppdatera</button> */}
          <button onClick={addProduct}>Lägg till product</button>
        </section>
      )}
      <button onClick={() => setShowModal(true)}>Lägg till produkt</button>
      {/* <button onClick={ getUsers }>
                Lista användare
            </button>
            <button onClick={ getProducts }>
                Lista produkter
            </button> */}
      {users &&
        users.map((user) => {
          return (
            <div key={user._id}>
              {user.email}, {user.firstname}, {user.lastname}, {user.adress}
              <button onClick={() => removeUser(user._id)}>ta bort</button>
            </div>
          )
        })}
      {products &&
        products.map((prod) => {
          return (
            <div key={prod._id}>
              <Link
                onClick={() =>
                  dispatch({ type: "current_product", payload: prod })
                }
                href={`/products/${prod._id}`}
              >
                {prod.name}
              </Link>
              , {prod.category}, {prod.price}
              <button
                onClick={() => {
                  setProduct({ ...prod })
                  setShowModal(true)
                }}
              >
                uppdatera
              </button>
              {/* <button onClick={ () => removeProduct(prod._id)}>ta bort</button> */}
            </div>
          )
        })}
    </>
  )
}

export default Admin
