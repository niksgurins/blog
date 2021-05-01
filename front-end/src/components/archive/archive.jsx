import PostAbstract from '../postAbstract/postAbstract';
import './archive.css'

const Archive = (props) => {
    const renderArchive = () => {
        return props.posts.map(post => {
            if (props.posts.indexOf(post) === 0 || props.posts.indexOf(post) === 7)
                return <PostAbstract key={post._id} post={post} size="large" />
            else
                return <PostAbstract key={post._id} post={post} size="small" />
        });
    }

    return (
        <div className="archive">
            {renderArchive()}
        </div>
    )
}

export default Archive