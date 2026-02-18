

export default function VideoCard({ video }) {
    return (
        <div className="bg-gray-800 rounded overflow-hidden shadow-lg">
            <a href={`/watch/${video.id}`} rel="noopener noreferrer">
            <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
            <div className="px-4 py-2">
                <h2 className="text-white font-semibold">{video.title}</h2>
                <p className="text-sm text-gray-400">{video.channelTitle}</p>
            </div>
            </a>
        </div>
    )
}