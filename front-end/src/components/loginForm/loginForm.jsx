import {useState} from 'react';
const crypto = require('crypto');

const Login = () => {
    const [loginDetails, setLoginDetails] = useState({
        username: "",
        password: ""
    });

    const updateLoginDetails = (e, loginField) => {
        setLoginDetails({...loginDetails, [loginField]: e.currentTarget.value});
    }

    const getRequestOptions = () => {
        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: "84fc8ce1ab11eae5d4296eaf2fc86ed9",
                //redirect_uri: "http://localhost:3000/",
                response_type: "code",
                grant_type: "authorization_code",
                username: loginDetails.username,
                password: crypto.createHash("sha256").update(loginDetails.password).digest("hex")
            })
        };
        
        return requestOptions;
    }

    const handleLogin = () => {
        fetch('http://localhost:9000/oauth/authorize', getRequestOptions())
            .then(res => res.text())
            .then(res => console.log(res))
            .catch(err => console.log(err));
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