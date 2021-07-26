import { useState, useRef } from 'react';
import '../../common/form.css';
import { useDispatch } from 'react-redux';
import { setUser } from '../../reduxSlices/userSlice';
import { X } from 'react-bootstrap-icons';

const Login = (props) => {
    const dispatch = useDispatch()
    const error = useRef();
    const errorBtn = useRef();

    const crypto = require('crypto');
    const [loginDetails, setLoginDetails] = useState({
        username: "",
        password: ""
    });

    const updateLoginDetails = (e, loginField) => {
        setLoginDetails({...loginDetails, [loginField]: e.currentTarget.value});
    }

    const getHttpRequest = () => {
        let requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `${btoa(`${loginDetails.username}:${crypto.createHash("sha256").update(loginDetails.password).digest("hex")}`)}`
            },
            credentials: 'include',
            body: JSON.stringify({
                client_id: "84fc8ce1ab11eae5d4296eaf2fc86ed9", // Need to figure out where to keep this
                response_type: "code",
                grant_type: "authorization_code",
            })
        };
        
        return requestOptions;
    }
    
    const handleLoginSuccess = (res) => {
        if (res.message === "Incorrect login credentials") {
            error.current.style.display = 'flex';
            errorBtn.current.style.display = 'block';
        }
        else {
            dispatch(setUser({ id: res.userId, firstName: res.firstName, lastName: res.lastName, intro: res.intro, img: res.img }));
            props.history.push('/');
        }
    }

    const hideErrorSection = () => {
        error.current.style.display = 'none';
        errorBtn.current.style.display = 'none';
    }

    const handleLogin = () => {
        if (loginDetails.username !== "" && loginDetails.password !== "") {
            fetch('http://localhost:9000/oauth/authorize', getHttpRequest())
                .then(res => res.json())
                .then(res => handleLoginSuccess(res))
                .catch(err => console.log(err));
        } else {
            error.current.style.display = 'flex';
            errorBtn.current.style.display = 'block';
        }
    }

    return (
        <div>
            <form>
                <div className="error" ref={error}>
                    Incorrect username or password.
                    <X size={20} ref={errorBtn} onClick={() => hideErrorSection()} />
                </div>
                <label>Username
                    <input value={loginDetails.username} onChange={(e) => updateLoginDetails(e, "username")}></input>
                </label>
                <label>Password
                    <input type="password" value={loginDetails.password} onChange={(e) => updateLoginDetails(e, "password")}></input>
                </label>
                <button type="button" onClick={() => handleLogin()}>Login</button>
            </form>
        </div>
    )
}

export default Login;