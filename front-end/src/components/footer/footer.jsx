import './footer.css';
import { NavLink } from "react-router-dom";
import { Github, Linkedin } from 'react-bootstrap-icons';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="links">
                    <p>Find me on social media</p>
                    <a href="https://github.com/niksgurins"><Github className="burger-icon" size={16} />Github</a>
                    <a href="https://www.linkedin.com/in/niksgurins/"><Linkedin className="burger-icon" size={16} />Linked In</a>
                </div>
                <div>
                    <ul className="menu">
                        <li><NavLink exact to="/">Home</NavLink></li>
                        <li><NavLink to="/about">About</NavLink></li>
                        <li><NavLink to="/contact">Contact</NavLink></li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer;