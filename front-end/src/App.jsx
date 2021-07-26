// React Imports
import { Route, BrowserRouter} from "react-router-dom";
import { useEffect } from 'react';
import { useDispatch, connect } from 'react-redux'
import { setUser } from './reduxSlices/userSlice'

// Component Imports
import Header from './components/header/header';
import Home from "./components/home/home";
import About from "./components/about/about";
import Contact from "./components/contact/contact";
import PostEditor from "./components/postEditor/postEditor";
import BlogPost from "./components/blogPost/blogPost";
import RegistrationForm from "./components/registrationForm/registrationForm";
import LoginForm from "./components/loginForm/loginForm";
import PostsByUser from "./components/postsByUser/postsByUser";
import Footer from "./components/footer/footer";
import ProfilePage from "./components/profilePage/profilePage";

// File imports 
import './app.css';

const App = (props) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if(props.user.id === '')
            fetch('http://localhost:9000/signedIn', { credentials: 'include' })
                .then(res => res.json())
                .then(res => { if(res.signedIn) dispatch(setUser({ id: res.userId, firstName: res.firstName, lastName: res.lastName, intro: res.intro, img: res.img }))})
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
                    <Route path="/users/:userId/posts" component={ PostsByUser }/>
                    <Route path="/profile" component={ ProfilePage }/>
                </div>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(App);