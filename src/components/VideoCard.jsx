import { forwardRef } from 'react'
import { Link } from 'react-router-dom'

const VideoCard = forwardRef(function VideoCard({ video }, ref) {
    const videoId = video.id?.videoId || video.id || ''
    const title = video.title || video.snippet?.title || 'Untitled'
    const thumbnail = video.thumbnail || video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.default?.url
    const channelTitle = video.channelTitle || video.snippet?.channelTitle || 'Unknown Channel'

    return (
        <article ref={ref} className="video-card">
            <Link to={videoId ? `/watch/${videoId}` : '#'} className="video-card__link">
                <div className="video-thumb">
                    <img src={thumbnail} alt={title} />
                    <span className="video-duration">Now</span>
                </div>
                <div className="video-meta">
                    <h2 className="video-title">{title}</h2>
                    <p className="video-channel">{channelTitle}</p>
                </div>
            </Link>
        </article>
    )
})

export default VideoCard