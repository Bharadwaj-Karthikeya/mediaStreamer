import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import RecommendedVideo from '../components/RecommendedVideo.jsx'

const getLastWatchedVideo = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const history = localStorage.getItem('watchHistory')
    const parsedHistory = history ? JSON.parse(history) : []
    return parsedHistory[0] || null
  } catch (error) {
    console.error('Unable to parse watch history:', error)
    return null
  }
}

const buildSearchQuery = (title = '') =>
  title
    .split(' ')
    .filter(Boolean)
    .slice(0, 3)
    .join(' ')

export default function Watch() {
  const { id } = useParams()
  const [videoDetails, setVideoDetails] = useState(null)
  const [recommendedVideos, setRecommendedVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [lastWatchedVideo, setLastWatchedVideo] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchRecommendations = async (title, apiKey) => {
      const query = buildSearchQuery(title)
      if (!query) return []

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`
      )
      const data = await response.json()
      return data.items || []
    }

    const fetchVideo = async (videoId, apiKey) => {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
      )
      const data = await response.json()
      if (!data.items || !data.items.length) {
        return null
      }
      return data.items[0]
    }

    async function hydratePage() {
      const lastWatched = getLastWatchedVideo()
      if (isMounted) {
        setLastWatchedVideo(lastWatched)
        if (!id) {
          setVideoDetails(null)
        }
      }

      const API_KEY = import.meta.env.VITE_VIDEO_API_KEY
      if (!API_KEY) {
        console.error('Missing VITE_VIDEO_API_KEY')
        if (isMounted) {
          setRecommendedVideos([])
          setLoading(false)
        }
        return
      }

      setLoading(true)

      if (!id) {
        if (!lastWatched?.snippet?.title) {
          if (isMounted) {
            setRecommendedVideos([])
            setLoading(false)
          }
          return
        }

        try {
          const recommendations = await fetchRecommendations(lastWatched.snippet.title, API_KEY)
          if (isMounted) {
            setRecommendedVideos(recommendations)
          }
        } catch (error) {
          console.error('Error fetching recommendations:', error)
        } finally {
          if (isMounted) {
            setLoading(false)
          }
        }
        return
      }

      try {
        const video = await fetchVideo(id, API_KEY)
        if (!video) {
          if (isMounted) {
            setVideoDetails(null)
            setRecommendedVideos([])
          }
          return
        }

        const recommendations = await fetchRecommendations(video.snippet.title, API_KEY)

        if (isMounted) {
          setVideoDetails(video)
          setRecommendedVideos(recommendations)
          saveToWatchHistory({
            id: { videoId: id },
            snippet: video.snippet
          })
        }
      } catch (error) {
        console.error('Error fetching video details:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    hydratePage()
    window.scrollTo(0, 0)

    return () => {
      isMounted = false
    }
  }, [id])

  const saveToWatchHistory = (video) => {
    if (typeof window === 'undefined') {
      return
    }

    const history = localStorage.getItem('watchHistory')
    let watchHistory = history ? JSON.parse(history) : []
    
    watchHistory = watchHistory.filter(item => 
      (item.id.videoId || item.id) !== (video.id.videoId || video.id)
    )
    
    watchHistory = [video, ...watchHistory].slice(0, 50)
    
    localStorage.setItem('watchHistory', JSON.stringify(watchHistory))
  }

  const renderRecommendationSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="flex gap-2 animate-pulse">
          <div className="w-40 h-24 bg-gray-200 dark:bg-gray-800 rounded-lg shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderRecommendationList = () => {
    if (loading) {
      return renderRecommendationSkeleton()
    }

    if (!recommendedVideos.length) {
      return (
        <p className="text-gray-600 dark:text-gray-400">
          No recommendations are available right now.
        </p>
      )
    }

    return (
      <div className="space-y-3">
        {recommendedVideos.map((video) => (
          <RecommendedVideo 
            key={video.id.videoId || video.id} 
            video={video} 
          />
        ))}
      </div>
    )
  }

  if (!id) {
    if (!lastWatchedVideo) {
      return (
        <div className="text-black dark:text-white">
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-2">Watch Page</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Start watching a video to get personalized recommendations.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="text-black dark:text-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Recommended for you</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Based on your last watched video:
              <span className="font-semibold text-black dark:text-white ml-1">
                {lastWatchedVideo.snippet?.title || 'Untitled'}
              </span>
            </p>
          </div>
          {renderRecommendationList()}
        </div>
      </div>
    )
  }

  return (
    <div className="text-black dark:text-white">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section - Video and Description */}
        <div className="flex-1">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${id}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Video Details */}
          {loading ? (
            <div className="mt-4 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-4"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          ) : videoDetails ? (
            <div className="mt-4">
              {/* Title */}
              <h1 className="text-xl font-semibold mb-3">
                {videoDetails.snippet.title}
              </h1>

              {/* Channel Info Row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg">
                  {videoDetails.snippet.channelTitle.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-base">{videoDetails.snippet.channelTitle}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(videoDetails.snippet.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }).replace(',', '')}
                  </div>
                </div>
              </div>

              {/* Description Box */}
              <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4">
                <div className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  {new Date(videoDetails.snippet.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <div className={`text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap ${!showFullDescription ? 'line-clamp-3' : ''}`}>
                  {videoDetails.snippet.description}
                </div>
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                >
                  {showFullDescription ? 'Show less' : 'Show more'}
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Right Section - Recommendations */}
        <div className="lg:w-96 shrink-0">
          <h3 className="text-lg font-semibold mb-4">Recommended</h3>
          {renderRecommendationList()}
        </div>
      </div>
    </div>
  )
}
