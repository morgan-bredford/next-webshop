import React, { useContext } from 'react';
import { DispatchContext } from '../contexts/contexts'
import Link from "next/link";
import styles from '../styles/menu.module.css'

function Menu(props) {
    const dispatch = useContext(DispatchContext)

    const setCategory = category => {
        dispatch({type: 'current_category', payload: category})
        props.setShowMenu(false)
    }

    return (
        <nav className={styles.menubar}>
            <ul className={styles.nav_ul+" "+styles.menu_nav_ul}>
                <li><h3 className={styles.h3_kategorier}>kategorier</h3></li>
                <Link href="/category/frukt">
                    <a><li className={styles.navlink} onClick={ () => setCategory('frukt') }>frukt</li></a>
                </Link>
                <Link href="/category/kläder">
                    <a><li className={styles.navlink} onClick={ () => setCategory('kläder') }>kläder</li></a>
                </Link>
                <Link href="/category/kök">
                    <li className={styles.navlink} onClick={ () => setCategory('kök') }>kök</li>
                </Link>
                <Link href="/category/möbler">
                    <li className={styles.navlink} onClick={ () => setCategory('möbler') }>möbler</li>
                </Link>
                <Link href="/category/elektronik">
                    <li className={styles.navlink} onClick={ () => setCategory('elektronik') }>elektronik</li>
                </Link>
            </ul>
            <span className={styles.menu_close} onClick={() => props.setShowMenu(false)} >
                stäng x
            </span>
        </nav>

    )
}

export default Menu;
