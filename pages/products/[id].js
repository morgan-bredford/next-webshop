import React, { useContext, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MongoClient, ObjectID } from "mongodb"
import { UserContext, DispatchContext } from "../../contexts/contexts"
import styles from "../../styles/product.module.css"

export const getStaticPaths = async () => {
  const client = await MongoClient.connect(process.env.DB_LOGIN)
  const db = client.db()
  const coll = db.collection("wbproducts")
  const products = await coll.find({}, { _id: 1 }).toArray()
  client.close()

  const paths = products.map((prod) => ({
    params: { id: prod._id.toString() },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const client = await MongoClient.connect(process.env.DB_LOGIN)
  const db = client.db()
  const coll = db.collection("wbproducts")
  const prod = await coll.findOne({ _id: ObjectID(params.id) })
  const rel_cat = await coll.find({ category: prod.category }).toArray()
  const rel_sel = await coll.find({ seller: prod.seller }).toArray()
  client.close()

  const product = {
    _id: prod._id.toString(),
    name: prod.name,
    category: prod.category,
    seller: prod.seller,
    price: prod.price,
    image: prod.image,
    description: prod.description,
  }

  const related_category = rel_cat.map((r_prod) => ({
    _id: r_prod._id.toString(),
    name: r_prod.name,
    seller: r_prod.seller,
    price: r_prod.price,
    image: r_prod.image,
  }))

  const related_seller = rel_sel.map((r_prod) => ({
    _id: r_prod._id.toString(),
    name: r_prod.name,
    seller: r_prod.seller,
    price: r_prod.price,
    image: r_prod.image,
  }))

  return {
    props: {
      product,
      related_category,
      related_seller,
    },
  }
}

const Product = (props) => {
  const userstate = useContext(UserContext)
  const dispatch = useContext(DispatchContext)
  const { _id, name, category, seller, price, image, description } =
    props.product
  const [categoryProducts, setCategoryProducts] = useState([])
  const [sellerProducts, setSellerProducts] = useState([])
  const [reverse, setReverse] = useState(true)

  const shuffleArray = (array) => {
    const new_array = [...array].sort(() => Math.random() - 0.5)
    if (reverse) new_array.reverse()
    setReverse(!reverse)
    return new_array
  }

  useEffect(() => {
    console.log(props.related_category)
    let temp_array = shuffleArray(props.related_category)
    temp_array.length = 3
    setCategoryProducts(temp_array)
    temp_array = shuffleArray(props.related_seller)
    temp_array.length = 3
    setSellerProducts(temp_array)
  }, [_id])

  const addToCart = (e, _id, name, seller, price, image) => {
    e.stopPropagation()
    e.preventDefault()
    dispatch({
      type: "add_to_cart",
      payload: { _id, name, seller, price, image },
    })
  }

  return (
    <>
      <section className={styles.product_info}>
        <section className={styles.name_img_desc}>
          <h1 className={styles.product_name_h1}>{name}</h1>
          <section className={styles.product_imagecontainer}>
            {/* <img src={`/images/${image}`} className={styles.product_image}/>   */}
            <Image
              src={`/images/${image}`}
              layout="fill"
              className={styles.product_image}
            />
          </section>
          <section className={styles.product_description}>
            Beskrivning: {description}
          </section>
        </section>
        <section>
          <div className={styles.price_add_seller}>
            <div className="product_preview_price">
              <div>
                {price}
                <span className="currency">kr</span>
              </div>
              <div
                className="buy_button"
                onClick={(e) => addToCart(e, _id, name, seller, price, image)}
              >
                köp
              </div>
            </div>
            <div className={styles.product_seller}>{seller}</div>
          </div>
        </section>
        <section className={styles.related}>
          <h4 className={styles.related_h4}>--- relaterade produkter ---</h4>
          {categoryProducts.map((product) => {
            return (
              <Link
                href={`/products/${product._id}`}
                key={product._id}
                onClick={() =>
                  dispatch({ type: "current_product", payload: product })
                }
              >
                <div className="product_preview">
                  <h3 className="product_preview_h3">{product.name}</h3>
                  <img
                    src={`/images/${product.image}`}
                    className="product_preview_image"
                  />
                  <div className="product_preview_price">
                    <div>
                      {product.price}
                      <span className="currency">kr</span>
                    </div>
                    <div
                      className="buy_button"
                      onClick={(e) =>
                        addToCart(
                          e,
                          product._id,
                          product.name,
                          product.seller,
                          product.price,
                          product.image
                        )
                      }
                    >
                      köp
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </section>
      </section>
      <section className={styles.sellers_section}>
        <h4 className={styles.sellers_h4}>FLER PRODUKTER FRÅN {seller}:</h4>
        <section className={styles.sellers_products}>
          {sellerProducts.map((product) => {
            return (
              <Link
                href={`/products/${product._id}`}
                key={product._id}
                onClick={() =>
                  dispatch({ type: "current_product", payload: product })
                }
              >
                <div className="product_preview">
                  <h3 className="product_preview_h3">{product.name}</h3>
                  <img
                    src={`/images/${product.image}`}
                    className="product_preview_image"
                  />
                  <div className="product_preview_price">
                    <div>
                      {product.price}
                      <span className="currency">kr</span>
                    </div>
                    <div
                      className="buy_button"
                      onClick={(e) =>
                        addToCart(
                          e,
                          product._id,
                          product.name,
                          product.seller,
                          product.price,
                          product.image
                        )
                      }
                    >
                      köp
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </section>
      </section>
    </>
  )
}

export default Product
