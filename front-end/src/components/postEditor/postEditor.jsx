import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MarkdownView from 'react-showdown';
import './postEditor.css';

const PostEditor = (props) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const renderBlogTitle = (e) => {
        setTitle(e.target.value);
    }

    const renderBlogContents = (e) => {
        setContent(e.target.value);
    }

    const getHttpRequest = () => {
        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                content: content,
                authorId: props.user.id,
                createdAt: new Date().getTime() / 1000
            })
        };

        return requestOptions;
    }

    const handleSubmitPost = () => {
        fetch('http://localhost:9000/posts', getHttpRequest())
            .then(res => res.text())
            .then(res => props.history.push('/posts/' + res))
            .catch(err => console.log(err))
    }

    useEffect(() => { // If user is not logged in send them to login page
        if(props.user.id === '')
            props.history.push('/login');
    })

    return (
        <div className="blog-writer">
            <div className="blog-inputs">
                <label className="blog-input-label">Title
                    <input type="text" className="blog-title-input" onChange={(e) => renderBlogTitle(e)} ></input>
                </label>
                <label className="blog-input-label">Contents
                    <textarea className="blog-textarea" onChange={(e) => renderBlogContents(e)} />
                </label>
                <button className="blog-post-btn" onClick={() => handleSubmitPost()}>Post</button>
            </div>
            <div className="blog-preview">
                <h2 className="blog-preview-label">Preview</h2>
                <hr />
                <h1 className="blog-preview-title">{title}</h1>
                <div className="blog-preview-content">
                    <MarkdownView markdown={content} options={{ tables: true, emoji: true, simpleLineBreaks: true }} />
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(PostEditor);