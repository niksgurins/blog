import React, { useEffect, useState } from "react";
import Archive from '../archive/archive'
 
const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (posts.length === 0) {
            let url = 'http://localhost:9000/posts/';
            fetch(url)
                .then(res => res.json())
                .then(res => setPosts(res))
                .catch(err => console.log(err));
        }
    })

    return (
        <div>
            <Archive posts={posts} archiveStyle="home-archive" />
        </div>
    );
}
 
export default Home;