import React from 'react';
import { NavLink } from "react-router-dom";

import './header.css';
import { List } from 'react-bootstrap-icons';

const Header = () => {
    const closeMenu = () => {
        document.getElementById("burger-menu-btn").checked = false;
    }

    return (
        <header className="header">
            <NavLink exact to="/"><button className="logo">Logo</button></NavLink>
            <input className="burger-menu-btn" type="checkbox" id="burger-menu-btn" />
            <div className="burger-menu-icon">
                <label htmlFor="burger-menu-btn">
                    <List className="burger-icon" size={28} />
                </label>
            </div>
            <ul className="menu">
                <li onClick={() => closeMenu()}><NavLink to="/new">New Post</NavLink></li>
                <li onClick={() => closeMenu()}><NavLink to="/about">About</NavLink></li>
                <li onClick={() => closeMenu()}><NavLink to="/contact">Contact</NavLink></li>
            </ul>
        </header>
    );
}

export default Header;