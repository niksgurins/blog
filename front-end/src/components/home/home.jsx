import React, { useEffect, useState } from "react";
import BlogPosts from '../blogPosts/blogPosts'
 
const Home = () => {
    const [apiResponse, setApiResponse] = useState("");

    useEffect(() => {
        if(apiResponse === "")
            fetch("http://localhost:9000/posts/0")
                .then(res => res.text())
                .then(res => setApiResponse(res));
    });

    return (
        <div>
            <BlogPosts />
        </div>
    );
}
 
export default Home;