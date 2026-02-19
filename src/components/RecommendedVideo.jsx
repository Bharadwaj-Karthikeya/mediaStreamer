import React from 'react'
import { Link } from 'react-router-dom'

export default function RecommendedVideo({ video }) {
  const { id, snippet } = video
  const videoId = id.videoId || id
  const { title, thumbnails, channelTitle } = snippet
  const imageUrl = thumbnails?.medium?.url || thumbnails?.high?.url || thumbnails?.default?.url

  return (
    <Link to={`/watch/${videoId}`} className="recommendation-card">
      <div className="recommendation-thumb">
        <img src={imageUrl} alt={title} />
        <span>Watch</span>
      </div>

      <div className="recommendation-copy">
        <h4>{title}</h4>
        <p>{channelTitle}</p>
      </div>
    </Link>
  )
}