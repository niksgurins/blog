import './profilePage.css';
import { useState, useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom";
import { connect, useDispatch } from 'react-redux';
import { setUserImage, setUser } from '../../reduxSlices/userSlice';
import profile from '../../profile.svg';
import Archive from '../archive/archive';
import { Pencil, X } from 'react-bootstrap-icons';

const ProfilePage = (props) => {
    const dispatch = useDispatch();

    
    const updatedUserFieldRefs = {
        img: useRef(),
        firstName: useRef(),
        lastName: useRef(),
        intro: useRef(),
        error: useRef(),
        errorBtn: useRef()
    }
    
    const [latestPosts, setLatestPosts] = useState([]);
    const [searchedForPosts, setSearchedForPosts] = useState(false);
    const [displayInputFields, setDisplayInputFields] = useState(false);
    const [updatedUserFields, setUpdatedUserFields] = useState({
        id: props.user.id, // Used only as a way to check if updatedUserFields has been populated
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        intro: props.user.intro
    })

    const handleImageUpload = () => {
        const getPutImageRequest = (img) => {
            let requestBody = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    img: img
                })
            };
    
            return requestBody;
        }

        let image = updatedUserFieldRefs.img.current.files[0];
        if (image !== undefined && image.size > 35000000) { // Check if image size is over 35mb
            // error file size too big
        } else {
            let reader = new FileReader();
            reader.onloadend = function() {
                console.log("fetching");
                fetch (`http://localhost:9000/users/${props.user.id}/img`, getPutImageRequest(reader.result))
                    .then(res => res.json())
                    .then(res => res.message === "Image updated successfully." ? dispatch(setUserImage({ img: reader.result })) : null)
                    .catch(err => console.log(err))
            }

            reader.readAsDataURL(image);
        } 
    }

    const handleChangeUserFields = (e, field) => {
        setUpdatedUserFields({...updatedUserFields, [field]: e.currentTarget.value});
        if (e.currentTarget.value.length <= 0) 
            updatedUserFieldRefs[field].current.style.border = "1px solid rgb(255, 99, 87)";

        if (e.currentTarget.value.length > 0 && updatedUserFieldRefs[field].current.style.border === "1px solid rgb(255, 99, 87)")
            updatedUserFieldRefs[field].current.style.border = "";
    }

    const handleSaveClick = () => {
        const getPutUserRequest = () => {
            let requestBody = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: updatedUserFields.firstName, 
                    lastName: updatedUserFields.lastName,
                    intro: updatedUserFields.intro
                })
            };

            return requestBody;
        }

        let blankFieldCount = 0;
        let fieldsChanged = 0;
        Object.keys(updatedUserFields).forEach(key => {
            if (updatedUserFields[key] === "") 
                blankFieldCount++;

            if (updatedUserFields[key] !== props.user[key])
                fieldsChanged++;
        });

        if (blankFieldCount > 0) {
            updatedUserFieldRefs.error.current.style.display = 'flex';
            updatedUserFieldRefs.errorBtn.current.style.display = 'block';
        } else if (fieldsChanged > 0) {
            hideErrorSection();
            fetch (`http://localhost:9000/users/${props.user.id}`, getPutUserRequest())
                    .then(res => res.json())
                    .then(res => { 
                        if (res.message === "User updated successfully.") 
                            dispatch(setUser({
                                ...props.user, 
                                firstName: updatedUserFields.firstName, 
                                lastName: updatedUserFields.lastName,
                                intro: updatedUserFields.intro
                            })); 
                        
                        setDisplayInputFields(!displayInputFields);
                    })
                    .catch(err => console.log(err))
        } else {
            hideErrorSection();
            setDisplayInputFields(!displayInputFields);
        }
        
        // Save
    }

    const handleCancelClick = () => {
        setUpdatedUserFields({
            firstName: props.user.firstName,
            lastName: props.user.lastName,
            intro: props.user.intro
        });
    }

    const hideErrorSection = () => {
        updatedUserFieldRefs.error.current.style.display = 'none';
        updatedUserFieldRefs.errorBtn.current.style.display = 'none';
    }

    const renderProfileDetails = () => {
        return !displayInputFields ?
            <div className='profile-details'>
                <img src={props.user.img === '' || props.user.img === undefined || props.user.img === null ? profile : props.user.img} alt='profile'></img>
                <p>{props.user.firstName} {props.user.lastName}</p>
                <hr />
                <p style={{textAlign: "left", fontSize: "1.8rem"}}>{props.user.intro}</p>
                <button onClick={() => setDisplayInputFields(!displayInputFields)}>Edit profile</button>
            </div>
            :
            <div className='profile-details'>
                <label style={{margin: 0, padding: 0, position: "relative"}} htmlFor="img-upload">
                    <span><Pencil size={14} />Edit</span>
                    <img src={props.user.img === '' || props.user.img === undefined || props.user.img === null ? profile : props.user.img} alt='profile'></img>
                </label>
                <div className="error" ref={updatedUserFieldRefs.error}>
                    Fill in every field.
                    <X size={20} ref={updatedUserFieldRefs.errorBtn} onClick={() => hideErrorSection()} />
                </div>
                <input ref={updatedUserFieldRefs.img} id="img-upload" type="file" accept="image/*" hidden onChange={() => handleImageUpload()}/>
                <label>
                    First Name
                    <input ref={updatedUserFieldRefs.firstName} value={updatedUserFields.firstName} onChange={(e) => handleChangeUserFields(e, "firstName")}></input>
                </label>
                <label>
                    Last Name
                    <input ref={updatedUserFieldRefs.lastName} value={updatedUserFields.lastName} onChange={(e) => handleChangeUserFields(e, "lastName")}></input>
                </label>
                <label>
                    Bio
                    <textarea ref={updatedUserFieldRefs.intro} value={updatedUserFields.intro} onChange={(e) => handleChangeUserFields(e, "intro")}></textarea>
                </label>
                <div style={{display: "flex", justifyContent: "space-around"}}>
                    <button className="save-btn" type="button" onClick={() => { handleSaveClick(); }}>Save</button>
                    <button type="button" onClick={() => { setDisplayInputFields(!displayInputFields); handleCancelClick(); }}>Cancel</button>
                </div>
            </div>
    }

    const renderProfilePosts = () => {
        return (
            latestPosts.length > 0 ? 
                <div className='profile-posts'>
                    <Archive posts={latestPosts} archiveStyle='profile-archive'/>
                    <div style={{display: "flex", justifyContent: "flex-end"}}>
                        <NavLink className="profile-posts-btn" to={`/users/${props.user.id}/posts`}>See all your posts</NavLink>
                    </div>
                </div>
                :
                <div className='profile-posts-blank'>
                    <h1>You haven't posted anything yet 🙁</h1>
                    <h2>Why not <NavLink className="profile-posts-btn" to="/new">Change that</NavLink> ?</h2>
                </div>
        )
    }

    useEffect(() => {
        if (!searchedForPosts) {
            let url = `http://localhost:9000/users/${props.user.id}/posts?limit=3`;
            fetch(url)
                .then(res => res.json())
                .then(res => { 
                    setSearchedForPosts(true); 
                    setLatestPosts(res); 
                })
                .catch(err => console.log(err));
        }

        if (props.user.id !== "" && updatedUserFields.id === "") { // Wait for user to be signedIn and set updatedUserFields values
            setUpdatedUserFields({
                firstName: props.user.firstName,
                lastName: props.user.lastName,
                intro: props.user.intro
            })
        }
    })

    return (
        <div className='profile-grid'>
            {renderProfileDetails()}
            {renderProfilePosts()}
        </div>
    )
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(ProfilePage);