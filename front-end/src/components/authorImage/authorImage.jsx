import { useState, useEffect } from 'react';
import './authorImage.css'
import profile from '../../profile.svg';

const AuthorImage = ({ authorId }) => {
    const [src, setSrc] = useState("");

    useEffect(() => {
        if (src === "")
            getAuthorDetails();
    });
    
    const getAuthorDetails = () => {
        fetch(`http://localhost:9000/users/${authorId}/img`)
            .then(res => res.json())
            .then(res => res.message !== "Image not found" ? setSrc(res.message) : setSrc(null))
            .catch(err => console.log(err));
    }

    return (
        <div>
            <img className="author-image" src={src !== null ? src : profile} alt="Author Profile"></img>
        </div>
    )
}

export default AuthorImage;