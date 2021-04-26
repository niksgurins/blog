import {useState} from 'react'
import '../../common/form.css'
import { useDispatch } from 'react-redux'
import { setUser } from '../../reduxSlices/userSlice'

const Login = (props) => {
    const dispatch = useDispatch()

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

    const handleLogin = () => {
        fetch('http://localhost:9000/oauth/authorize', getHttpRequest())
            .then(res => res.json())
            .then(res => {
                dispatch(setUser({id: res.userId, name: res.firstName}));
                props.history.push('/');
            }).catch(err => console.log(err));
    }

    return (
        <div>
            <form>
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