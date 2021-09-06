import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link'
import { MongoClient } from 'mongodb'
import { UserContext, DispatchContext } from '../../contexts/contexts'

export const getStaticPaths = () => {
    return {
        paths: [
          { params: { category: 'frukt' } },
          { params: { category: 'möbler' } },
          { params: { category: 'kläder' } },
          { params: { category: 'kök' } },
          { params: { category: 'elektronik' } }
        ],
        fallback: false
      }
      
}

export const getStaticProps = async ({ params }) => {
  const client = await MongoClient.connect(process.env.DB_LOGIN)
  const db = client.db()
  const coll = db.collection('wbproducts')
  const products = await coll.find({category: params.category}).toArray()
  client.close()

  const pr = products.map( prod => {
    return { _id: prod._id.toString(), name: prod.name, seller: prod.seller, image: prod.image, price: prod.price }
  }) 

  return {
    props: {
      products: pr
    }
  }

}

const Category = (props) => {
    const dispatch = useContext(DispatchContext)
    const { current_category } = useContext(UserContext)
    const [products, setProducts] = useState(props.products)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setProducts(props.products)
    },[props.products])

//   const router = useRouter()
//   console.log(router)
    // useEffect( () => {
    //     setLoading(true)

    //     axios
    //         .post( URL + "/graphql", {query : `
    //         {
    //             products_by_category(category: "${current_category}") {
    //                 _id,
    //                 name,
    //                 category,
    //                 price,
    //                 quantity,
    //                 image,
    //                 description,
    //                 seller {
    //                     name,
    //                     products {
    //                         _id,
    //                         name,
    //                         image,
    //                         price
    //                     }
    //                 }
    //             }
    //         }`})
    //         .then((res) => {
    //             setLoading(false)
    //             setProducts(res.data.data.products_by_category)
    //         })    
    // },[current_category])

    const addToCart = ( e, _id, name, seller, price, image ) => {
        e.stopPropagation()
        e.preventDefault()
        dispatch({type: 'add_to_cart', payload: { _id, name, seller, price, image } })
    }

    return(
        <>
            <h2 className="h2_categories">{current_category}</h2>
            <section className="category_main">
            { loading && <Loader /> } 
            {
                products.map( product => {
                    const { _id, name, seller, price, image } = product
                    return (
                        <Link
                            href={`/products/${_id}`}
                            key={_id} 
                            onClick={ () => dispatch({type: 'current_product', payload: product}) } >
                            <div className="product_preview">
                                <h3 className="product_preview_h3">{name}</h3>
                                <img src={`/images/${image}`} className="product_preview_image" />
                                <div className="product_preview_price">
                                    <div>
                                        {price}<span className="currency">kr</span>
                                    </div>
                                    <div className="buy_button" onClick={ (e) => addToCart(e, _id, name, seller, price, image) }>
                                        köp
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                } )
            }
            </section>
        </>
    )
}

export default Category