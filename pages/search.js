import React, { useContext, useEffect, useState } from "react"
import { UserContext, DispatchContext } from "../contexts/contexts"
import Link from "next/link"

export const getServerSideProps = async (context) => {
  const query = context.query.search

  const res = await fetch(
    "http://ec2-13-48-85-50.eu-north-1.compute.amazonaws.com:8181/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
                {
                    products_search(name: "${query}" ) {
                        _id,
                        name,
                        category,
                        price,
                        quantity,
                        image,
                        description,
                        seller {
                            name,
                            products {
                                _id,
                                name,
                                image,
                                price
                            }
                        }
                    }
                }`,
      }),
    }
  )
  const search = await res.json()

  return {
    props: {
      products: search.data.products_search,
    },
  }
}

const Search = (props) => {
  const dispatch = useContext(DispatchContext)
  const { current_search } = useContext(UserContext)
  const [products, setProducts] = useState(props.products)
  const [loading, setLoading] = useState(false)

  useEffect(() => setProducts(props.products), [props.products])

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
      <h2 className="h2_categories">sökresultat</h2>
      <section className="category_main">
        {!products && <section>Loading...</section>}
        {products.length ? (
          products.map((product) => {
            const { _id, name, seller, price, image } = product
            return (
              <Link
                href={`/products/${_id}`}
                key={_id}
                onClick={() =>
                  dispatch({ type: "current_product", payload: product })
                }
              >
                <div className="product_preview">
                  <h3 className="product_preview_h3">{name}</h3>
                  <img
                    src={`/images/${image}`}
                    className="product_preview_image"
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
          })
        ) : (
          <section className="no_search_result">
            Tyvärr, din sökning gav inget resultat
          </section>
        )}
      </section>
    </>
  )
}

export default Search
