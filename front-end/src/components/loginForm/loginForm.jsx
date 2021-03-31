import {useState} from 'react';

const Login = () => {
    const [loginDetails, setLoginDetails] = useState({
        username: "",
        password: ""
    });

    const updateLoginDetails = (e, loginField) => {
        setLoginDetails({...loginDetails, [loginField]: e.currentTarget.value});
    }

    const handleLogin = () => {

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