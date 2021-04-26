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

const App = () => {
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

export default App;
