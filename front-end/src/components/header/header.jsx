import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import './header.css';
import profile from '../../profile.svg';
import { List, CaretDownFill } from 'react-bootstrap-icons';

const Header = (props) => {
    const closeMenu = () => {
        document.getElementById("burger-menu-btn").checked = false;
    }

    const showGreeting = () => {
        return props.user.name !== '' ? `Hello, ${props.user.name}` : '';
    }

    useEffect(() => {
        showGreeting();
    })

    return (
        <header className="header">
            <input className="burger-menu-btn" type="checkbox" id="burger-menu-btn" />
            <div className="header-content">
                <NavLink exact to="/"><button className="logo" onClick={() => closeMenu()}>Logo</button></NavLink>
                <div className="burger-menu-icon">
                    <label htmlFor="burger-menu-btn">
                        <List className="burger-icon" size={28} />
                    </label>
                </div>
                <div className="profile">
                    <img className="profile-logo" src={profile} alt="profile" /> 
                    <CaretDownFill className="profile-icon" size={20} />
                    <p className="greeting">{showGreeting()}</p>
                    <div className="profile-dropdown-content">
                        <li className={props.signedIn ? 'hide' : ''} onClick={() => closeMenu()}><NavLink to="/login">Sign in</NavLink></li>
                        <li className={props.signedIn ? 'hide' : ''} onClick={() => closeMenu()}><NavLink to="/register">Sign up</NavLink></li>
                        <li className={!props.signedIn ? 'hide' : ''} onClick={() => closeMenu()}><NavLink to="/profile">Profile</NavLink></li>
                        <li className={!props.signedIn ? 'hide' : ''} onClick={() => closeMenu()}><NavLink to="/posts/user/:userId">Your Posts</NavLink></li>
                        <li className={!props.signedIn ? 'hide' : ''} onClick={() => closeMenu()}><NavLink to="/new">New Post</NavLink></li>
                    </div>
                </div>
            </div>
            <ul className="menu">
                <li onClick={() => closeMenu()}><NavLink to="/about">About</NavLink></li>
                <li onClick={() => closeMenu()}><NavLink to="/contact">Contact</NavLink></li>
            </ul>
        </header>
    );
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(Header);