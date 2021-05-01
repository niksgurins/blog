import {useState} from 'react';
import BLANKUSER from '../../constants/blankUser';
import '../../common/form.css';

const RegistrationForm = () => {
    const crypto = require("crypto");
    const [userDetails, setUserDetails] = useState({...BLANKUSER});
    const [passwordCheck, setPasswordCheck] = useState("");
    const [registerStatus, setRegisterStatus] = useState("");

    const updateUserDetails = (e, userField) => {
        setUserDetails({...userDetails, [userField]: e.currentTarget.value})
    }

    const passwordsMatching = (password2) => {
        return password2 === userDetails.password;
    }

    const updatePasswordCheck = (e) => {
        setPasswordCheck(e.currentTarget.value);
        let matching = passwordsMatching(e.currentTarget.value); // passwordCheck doesn't get updated until after this
        setRegisterStatus(matching ? 'Passwords Matching' : 'Passwords are not matching');
        setRegisterStatusColor(!matching);
    }

    const getHttpRequest = () => {
        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...userDetails,
                password: crypto.createHash("sha256").update(userDetails.password).digest("hex")
            })
        };

        return requestOptions;
    }

    const handleRegister = () => {
        fetch("http://localhost:9000/users", getHttpRequest())
            .then(res => res.status === 200 ? registrationSuccess() : res.json())
            .then(res => res !== undefined ? registrationFailure(res.message) : null)
            .catch(err => registrationFailure(err));
    }

    const registrationSuccess = () => {
        setUserDetails({...userDetails});
        setRegisterStatusColor(false);
        setRegisterStatus('Registration Success');
    }

    const registrationFailure = (message) => {
        setRegisterStatusColor(true);
        setRegisterStatus(message);
    }

    const setRegisterStatusColor = (err) => {
        err ?
            document.getElementById("register-status").style.color = "#CD3333" :
            document.getElementById("register-status").style.color = "green";
    }

    return (
        <div>
            <form>
                <label>Username
                    <input value={userDetails.username} onChange={(e) => updateUserDetails(e, "username")}></input>
                </label>
                <label>Password
                    <input type="password" value={userDetails.password} onChange={(e) => updateUserDetails(e, "password")}></input>
                </label>
                <label>Re-type Password
                    <input type="password" value={passwordCheck} onChange={(e) => updatePasswordCheck(e)}></input>
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
            <p id="register-status">{registerStatus}</p>
        </div>
    )
}

export default RegistrationForm;