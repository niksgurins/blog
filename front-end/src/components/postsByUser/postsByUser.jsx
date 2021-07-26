import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Archive from '../archive/archive';
import './postsByUser.css';
 
const PostsByUser = (props) => {
    const [posts, setPosts] = useState([]);
    const [searchedForPosts, setSearchedForPosts] = useState(false);

    useEffect(() => {
        if (!searchedForPosts) {
            let url = `http://localhost:9000/users/${props.user.id}/posts`;
            fetch(url)
                .then(res => res.json())
                .then(res => { setSearchedForPosts(true); setPosts(res); })
                .catch(err => console.log(err));
        }
    })

    const renderPostsByUser = () => {
        return (
            posts.length > 0 ? 
                <div>
                    <Archive posts={posts} archiveStyle="home-archive"/>
                </div>
                :
                <div className="no-posts">
                    <h1>This user hasn't posted anything yet 🙁</h1>
                </div>
        )
    }

    return (
        <div>
            {renderPostsByUser()}
        </div>
    );
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(PostsByUser);