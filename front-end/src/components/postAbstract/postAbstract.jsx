import { useHistory } from 'react-router';
import MarkdownView from 'react-showdown';
import './postAbstract.css';
import AuthorImage from '../authorImage/authorImage';

const PostAbstract = (props) => {
    const history = useHistory();

    const renderAuthor = () => {
        return (
            props.size === "large" ?
                <div style={{"display": "flex", "alignItems": "center"}}>
                    <p className='forward-slash'>/</p>
                    <AuthorImage authorId={props.post.authorId} />
                    <i>by</i>
                    <b style={{ 'fontWeight': '600' }}>
                        {` ${props.post.authorFirstName} ${props.post.authorLastName} `}
                    </b>
                    <i>on</i>
                    <b style={{ 'fontWeight': '600' }}>
                        {` ${new Date(props.post.createdAt * 1000).toUTCString().slice(5, 16)}`}
                    </b>
                </div>
                :
                <div style={{"display": "flex", "alignItems": "center"}}>
                    <p className='forward-slash'>/</p>
                    <AuthorImage authorId={props.post.authorId} />
                    <b style={{ 'fontWeight': '600' }}>
                        {`${props.post.authorFirstName} ${props.post.authorLastName} `}
                    </b>
                </div>
        )
    }

    const renderIntro = () => {
        if (props.size === "large")
            return (
                <div className="intro">
                    <MarkdownView markdown={props.post.content} />
                </div>
            )
        else
            <>
            </>
    }

    return (
        <div className={props.size === "large" ? "post-abstract-large" : "post-abstract-small"} onClick={() => history.push(`/posts/${props.post.postId}`)}>
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