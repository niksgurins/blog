import './app.css';
import './components/header/header.css';
import Header from './components/header/header';
import {
    Route,
    BrowserRouter
} from "react-router-dom";
import Home from "./components/home/home";
import About from "./components/about/about";
import Contact from "./components/contact/contact";
import PostEditor from "./components/postEditor/postEditor";
import BlogPost from "./components/blogPost/blogPost";
import RegistrationForm from "./components/registrationForm/registrationForm";
import LoginForm from "./components/loginForm/loginForm";
import { useEffect } from 'react';
import { useDispatch, connect } from 'react-redux'
import { setUser } from './reduxSlices/userSlice'

const App = (props) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if(props.user.id === '')
            fetch('http://localhost:9000/signedIn', { credentials: 'include' })
                .then(res => res.json())
                .then(res => { if(res.signedIn) dispatch(setUser({id: res.userId, name: res.firstName}))})
                .catch(err => console.log(err));
    });

    return (
        <BrowserRouter>
            <div className="app">
                <Header />
                <div className="content" id="content">
                    <Route exact path="/" component={ Home }/>
                    <Route path="/about" component={ About }/>
                    <Route path="/contact" component={ Contact }/>
                    <Route path="/new" component={ PostEditor }/>
                    <Route path="/posts/:postId" component={ BlogPost }/>
                    <Route path="/register" component={ RegistrationForm }/>
                    <Route path="/login" component={ LoginForm } />
                </div>
            </div>
        </BrowserRouter>
    );
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(App);