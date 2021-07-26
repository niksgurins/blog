import PostAbstract from '../postAbstract/postAbstract';
import './archive.css'

const Archive = ({ posts, archiveStyle }) => {
    const renderArchive = () => {
        return posts.map(post => {
            if (posts.indexOf(post) === 0 || posts.indexOf(post) === 7)
                return <PostAbstract key={post._id} post={post} size="large" />
            else
                return <PostAbstract key={post._id} post={post} size="small" />
        });
    }

    return (
        <div className={archiveStyle}>
            {renderArchive()}
        </div>
    )
}

export default Archive