import {useEffect, useState} from 'react';
import PostAbstract from '../postAbstract/postAbstract';
import './archive.css'

const Archive = () => {
    const [posts, setPosts] = useState([]);

    const renderArchive = () => {
        return posts.map(post => {
            if (posts.indexOf(post) === 0 || posts.indexOf(post) === 7)
                return <PostAbstract key={post._id} post={post} size="large" />
            else
                return <PostAbstract key={post._id} post={post} size="small" />
        });
    }

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
        <div className="archive">
            {renderArchive()}
        </div>
    )
}

export default Archive