import React, { useEffect } from 'react';
import { NavLink, useHistory } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { clearUser } from '../../reduxSlices/userSlice'

import './header.css';
import profile from '../../profile.svg';
import { List, CaretDownFill } from 'react-bootstrap-icons';

const Header = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const closeMenu = () => {
        document.getElementById("burger-menu-btn").checked = false;
    }

    const showGreeting = () => {
        return props.user.firstName !== '' ? `Hello, ${props.user.firstName}` : '';
    }
    
    const signOut = () => {
        dispatch(clearUser());
        closeMenu();
        fetch('http://localhost:9000/signOut', { credentials: 'include' }) // Expire the existing httpOnly cookies
            .then(res => history.push('/'))
            .catch(err => console.log(err));
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
                    <img className="profile-logo" src={props.user.img === '' || props.user.img === undefined || props.user.img === null ? profile : props.user.img} alt="profile" /> 
                    <CaretDownFill className="profile-icon" size={20} />
                    <p className="greeting">{showGreeting()}</p>
                    <div className={props.user.signedIn ? 'profile-dropdown-content signed-in-menu' : 'profile-dropdown-content'}>
                        <li className={props.user.signedIn ? 'hide' : ''} onClick={() => closeMenu()}><NavLink to="/login">Sign in</NavLink></li>
                        <li className={props.user.signedIn ? 'hide' : ''} onClick={() => closeMenu()}><NavLink to="/register">Sign up</NavLink></li>
                        <li className={!props.user.signedIn ? 'hide' : ''} onClick={() => closeMenu()}><NavLink to="/profile">Profile</NavLink></li>
                        <li className={!props.user.signedIn ? 'hide' : ''} onClick={() => closeMenu()}><NavLink to={`/users/${props.user.id}/posts`}>Your Posts</NavLink></li>
                        <li className={!props.user.signedIn ? 'hide' : ''} onClick={() => closeMenu()}><NavLink to="/new">New Post</NavLink></li>
                        <li className={!props.user.signedIn ? 'hide' : ''} onClick={() => signOut()}><a>Sign Out</a></li>
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