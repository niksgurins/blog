import { useHistory } from 'react-router';
import MarkdownView from 'react-showdown';
import './postAbstract.css';

const PostAbstract = (props) => {
    const history = useHistory();

    const renderAuthor = () => {
        return ( 
            props.size === "large" ? 
            <p>
                <i>by</i>
                <b style={{'fontWeight': '600'}}>
                    {` ${props.post.authorFirstName} ${props.post.authorLastName} `}
                </b>
                <i>on</i>
                <b style={{'fontWeight': '600'}}>
                    {` ${new Date(props.post.createdAt * 1000).toUTCString().slice(0, 16)}`}
                </b>
            </p> :
            <p>{props.post.authorFirstName} {props.post.authorLastName}</p>
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
        <div className={props.size==="large"? "post-abstract-large" : "post-abstract-small"} onClick={() => history.push(`/posts/${props.post.postId}`)}>
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