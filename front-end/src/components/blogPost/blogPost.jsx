import { useEffect, useState } from 'react';
import MarkdownView from 'react-showdown';
import BLANKPOST from '../../dataTemplates/blankPost'
import './blogPost.css';

const BlogPost = (props) => {
    const [postId, setPostId] = useState(props.match.params.postId);
    const [blogPostDetails, setBlogPostDetails] = useState({
        ...BLANKPOST
    })

    const fetchBlog = () => {
        const url = `http://localhost:9000/posts/${postId}`;
        fetch(url)
            .then(res => res.json())
            .then(res => setBlogPostDetails({ 
                title: res.title,
                content: res.content,
                authorId: res.authorId,
                createdAt: res.createdAt
            }))
            .catch(err => console.log(err));
    }

    useEffect(() => {
        if(JSON.stringify({...blogPostDetails}) === JSON.stringify({...BLANKPOST}))
            fetchBlog();
    });

    return (
        <div className="blog-post">
            <h1 className="blog-post-title">{ blogPostDetails.title }</h1>
            <MarkdownView className="blog-post-content" markdown={ blogPostDetails.content } options={{ tables: true, emoji: true, simpleLineBreaks: true }} />
        </div>
    );
}

export default BlogPost;