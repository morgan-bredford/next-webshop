import React, { useContext, useEffect, useState } from 'react';
import { UserContext, DispatchContext } from '../contexts/contexts'
import Link from 'next/link'
import styles from '../styles/cart.module.css'

const Cart = (props) => {
    const dispatch = useContext(DispatchContext)
    const { cart } = useContext(UserContext)
    const [totalCost, setTotalCost] = useState(0)

    useEffect ( () => {
        let cost = 0
        cart?.forEach(prod => {
            cost = cost + prod.price * prod.quantity
        })
        setTotalCost(cost)
    },[cart])

    const updateCart = (index, change) => {
        cart[index].quantity = cart[index].quantity + change
        dispatch({ type: 'update_cart', payload: cart})
    }

    return (
        <section className={styles.cart_bar}>
            <h3 className={styles.h3_varukorg}>varukorg</h3>
            { cart.length 
                ? 
                <section>
                    {cart.map( (product, index) => {
                        return <section className={styles.cart_item} key={product._id}>
                            <img src={`/images/${product.image}`} className={styles.cart_image} />
                            <Link href={`/products/${product._id}`}>
                                <div className={styles.cart_item_name}>{product.name}</div>
                            </Link>
                            <div className={styles.cart_inc_dec} onClick={ () => updateCart(index, -1) }>-</div>
                            <div className={styles.cart_item_quantity}>{product.quantity}</div>
                            <div className={styles.cart_inc_dec} onClick={ () => updateCart(index, 1) }>+</div>
                            <div className={styles.cart_item_price}>{product.price * product.quantity}<span className="currency">kr</span></div>
                        </section>
                    })} 
                    <section className={styles.cart_total_price}>Totalpris: {totalCost}<span className="currency">kr</span></section>
                </section>
                : <div className={styles.empty_basket}>du har inga varor i din korg</div>
            }
            <span className={styles.cart_close} onClick={() => props.setShowCart(false)} >x stäng</span>
        </section>
    )

}

export default Cart