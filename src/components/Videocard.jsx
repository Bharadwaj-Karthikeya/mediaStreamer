import { forwardRef } from 'react'

const VideoCard = forwardRef(function VideoCard({ video }, ref) {
    return (
        <div ref={ref} className="bg-gray-800 rounded overflow-hidden shadow-lg">
            <a href={`/watch/${video.id}`} rel="noopener noreferrer">
                <img src={video.thumbnail || video.snippet?.thumbnails?.default?.url} alt={video.title || video.snippet?.title || 'Untitled'} className="w-full h-48 object-cover" />
                <div className="px-4 py-2">
                    <h2 className="text-white font-semibold">{video.title || video.snippet?.title || 'Untitled'}</h2>
                    <p className="text-sm text-gray-400">{video.channelTitle || video.snippet?.channelTitle || 'Unknown Channel'}</p>
                </div>
            </a>
        </div>
    )
})

export default VideoCard