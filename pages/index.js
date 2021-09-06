import React, { useContext, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MongoClient } from "mongodb"
import { UserContext, DispatchContext } from "../contexts/contexts"

export const getStaticProps = async () => {
  const client = await MongoClient.connect(process.env.DB_LOGIN)
  const db = client.db()
  const coll = db.collection("wbproducts")
  const products = await coll.find().toArray()
  client.close()

  const pr = products.map((prod) => {
    return {
      _id: prod._id.toString(),
      name: prod.name,
      seller: prod.seller,
      image: prod.image,
      price: prod.price,
    }
  })

  return {
    props: {
      products: pr,
    },
  }
}

const Home = (props) => {
  const dispatch = useContext(DispatchContext)
  const userstate = useContext(UserContext)
  const [products, setProducts] = useState(props.products)
  const [reverse, setReverse] = useState(true)
  const [activeProduct, setActiveProduct] = useState({})
  const [loading, setLoading] = useState(false)

  const shuffleArray = (array) => {
    const new_array = [...array].sort(() => Math.random() - 0.5)
    if (reverse) new_array.reverse()
    setReverse(!reverse)
    return new_array
  }

  useEffect(() => {
    const temp_array = shuffleArray(props.products)
    temp_array.length = 5
    setProducts(temp_array)
  }, [])

  // useEffect( () => {
  //     setLoading(true)

  //     axios
  //         .post( URL + "/graphql", {query : `
  //         {
  //             products
  //                 {
  //                     _id,
  //                     name,
  //                     category,
  //                     price,
  //                     quantity,
  //                     image,
  //                     description,
  //                     seller {
  //                         name
  //                     }
  //                 }
  //         }`})
  //         .then((res) => {
  //             setLoading(false)
  //             const temp_array = shuffleArray(res.data.data.products)
  //             temp_array.length = 5
  //             setProducts(temp_array)
  //         })
  // },[])

  const addToCart = (e, _id, name, seller, price, image) => {
    e.stopPropagation()
    e.preventDefault()
    dispatch({
      type: "add_to_cart",
      payload: { _id, name, seller, price, image },
    })
  }

  const prevProduct = () => {
    const p = products.shift()
    products.push(p)
    setProducts(products)
    setActiveProduct(products[2])
  }

  const nextProduct = () => {
    const p = products.pop()
    products.unshift(p)
    setProducts(products)
    setActiveProduct(products[2])
  }

  const addClasses = () => {
    for (let i = 0; i < 5; i++) {
      document.getElementById(`${i}`)?.classList.add("carousel_scale")
    }
    document.getElementById(2)?.classList.add("carousel_active_product")
  }

  // useEffect( () => addClasses(),[activeProduct])

  return (
    <>
      <h1 className="home_h1">mb's webbshop</h1>
      <section className="carousel_container">
        <span
          className="carousel_arrowcontainer"
          onClick={prevProduct}
          style={{ paddingRight: "0.5vw" }}
        >
          <Image src="/images/back_arrow.png" width={150} height={150} />
        </span>
        <span className="carousel_products">
          {loading && <section>Loading...</section>}
          {products.map((product, index) => {
            const { _id, name, seller, price, image } = product
            return (
              <Link
                href={`/products/${_id}`}
                key={_id}
                onClick={() =>
                  dispatch({ type: "current_product", payload: product })
                }
              >
                <div
                  className="product_preview carousel_scale"
                  // className={index === 2 ? "product_preview carousel_active_product" : "product_preview" }
                  id={index}
                  style={
                    index === 0 || index === 4 ? { display: "none" } : null
                  }
                >
                  <h3 className="product_preview_h3">{name}</h3>
                  <Image
                    src={`/images/${image}`}
                    className="product_preview_image"
                    width={300}
                    height={300}
                  />
                  <div className="product_preview_price">
                    <div>
                      {price}
                      <span className="currency">kr</span>
                    </div>
                    <div
                      className="buy_button"
                      onClick={(e) =>
                        addToCart(e, _id, name, seller, price, image)
                      }
                    >
                      köp
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </span>
        <span className="carousel_arrowcontainer" onClick={nextProduct}>
          <Image src="/images/forward_arrow.png" width={150} height={150} />
        </span>
      </section>
    </>
  )
}

export default Home
