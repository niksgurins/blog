import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Archive from '../archive/archive'
 
const PostsByUser = (props) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (posts.length === 0) {
            let url = `http://localhost:9000/users/${props.user.id}/posts`;
            fetch(url)
                .then(res => res.json())
                .then(res => setPosts(res))
                .catch(err => console.log(err));

            console.log(posts);
        }
    })

    return (
        <div>
            <Archive posts={posts}/>
        </div>
    );
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(PostsByUser);