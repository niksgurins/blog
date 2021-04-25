import {useEffect} from 'react';
import MarkdownView from 'react-showdown';
import './postAbstract.css';

const PostAbstract = (props) => {
    const renderAuthor = () => {
        return ( 
            props.size === "large" ? 
            <p>{props.post.authorId} {props.post.createdAt}</p> :
            <p>{props.post.authorId}</p>
        )
    }
    
    const renderIntro = () => {
        if (props.size === "large")
            return (
                <div className="intro">
                    <MarkdownView markdown={`${props.post.content.slice(0, props.post.content.length >= 60 ? 60 : props.post.content.length).toString()}...`} />
                </div>
            )
        else 
            return (
                <div className="intro">
                    <MarkdownView markdown={`${props.post.content.slice(0, props.post.content.length >= 23 ? 23 : props.post.content.length).toString()}...`} />
                </div>
            );
    }

    return (
        <div className={props.size==="large"? "post-abstract-large" : "post-abstract-small"}>
            <div className="author">
                {renderAuthor()}
            </div>
            <div className="title">
                <h1>{props.post.title}</h1>
            </div>
            <div>
                {renderIntro()}
            </div>
        </div>
    )
}

export default PostAbstract;