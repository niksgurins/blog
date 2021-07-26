import { useState, useRef } from 'react';
import BLANKUSER from '../../dataTemplates/blankUser';
import '../../common/form.css';
import { useDispatch } from 'react-redux';
import { setUser } from '../../reduxSlices/userSlice';
import { X } from 'react-bootstrap-icons';

const RegistrationForm = (props) => {
    const dispatch = useDispatch()
    const crypto = require("crypto");

    const error = useRef();
    const errorBtn = useRef();

    const [userDetails, setUserDetails] = useState({...BLANKUSER});
    const [passwordCheck, setPasswordCheck] = useState("");
    const [registerStatus, setRegisterStatus] = useState("");

    const updateUserDetails = (e, userField) => {
        setUserDetails({...userDetails, [userField]: e.currentTarget.value})
    }

    const getHttpRequest = () => {
        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...userDetails,
                password: crypto.createHash("sha256").update(userDetails.password).digest("hex"),
            })
        };

        return requestOptions;
    }

    const handleRegister = () => {
        if (passwordCheck === userDetails.password) {
            fetch("http://localhost:9000/users", getHttpRequest())
                .then(res => res.status === 200 ? registrationSuccess() : res.json())
                .then(res => res !== undefined ? registrationFailure(res.message) : null)
                .catch(err => registrationFailure(err));
        } else 
            registrationFailure("Passwords are not matching.");
    }

    const registrationSuccess = () => {
        const getLoginRequest = () => {
            let requestOptions = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `${btoa(`${userDetails.username}:${crypto.createHash("sha256").update(userDetails.password).digest("hex")}`)}`
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
            fetch('http://localhost:9000/oauth/authorize', getLoginRequest())
                .then(res => res.json())
                .then(res => handleLoginSuccess(res))
                .catch(err => console.log(err));
        }

        setRegisterStatus('Registration successful.');
        handleLogin();

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

    const registrationFailure = (message) => {
        setRegisterStatus(message);
        error.current.style.display = 'flex';
        errorBtn.current.style.display = 'block';
    }

    return (
        <div>
            <form>
                <div className="error" ref={error}>
                    {registerStatus}
                    <X size={20} ref={errorBtn} onClick={() => hideErrorSection()} />
                </div>
                <label>Username
                    <input value={userDetails.username} onChange={(e) => updateUserDetails(e, "username")}></input>
                </label>
                <label>Password
                    <input type="password" value={userDetails.password} onChange={(e) => updateUserDetails(e, "password")}></input>
                </label>
                <label>Re-type Password
                    <input type="password" value={passwordCheck} onChange={(e) => setPasswordCheck(e.currentTarget.value)}></input>
                </label>
                <label>First Name
                    <input value={userDetails.firstName} onChange={(e) => updateUserDetails(e, "firstName")}></input>
                </label>
                <label>Last Name
                    <input value={userDetails.lastName} onChange={(e) => updateUserDetails(e, "lastName")}></input>
                </label>
                <label>Personal Introduction
                    <input value={userDetails.intro} onChange={(e) => updateUserDetails(e, "intro")}></input>
                </label>
                <button type="button" onClick={() => handleRegister()}>Register</button>
            </form>
        </div>
    )
}

export default RegistrationForm;