import React, { useState, useEffect, useRef, useCallback } from 'react'
import VideoCard from '../components/VideoCard'
import ShimmerCard from '../components/Shimmer'

const normalizeVideoId = (video) => {
    if (!video) return null;
    if (typeof video.id === 'string') return video.id;
    return video.id?.videoId || null;
};

const mergeUniqueVideos = (incoming, existing = []) => {
    const seen = new Set(existing.map(normalizeVideoId).filter(Boolean));
    const uniqueIncoming = incoming.filter(video => {
        const id = normalizeVideoId(video);
        if (!id || seen.has(id)) {
            return false;
        }
        seen.add(id);
        return true;
    });
    return [...existing, ...uniqueIncoming];
};

export default function HomeScroll() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPageToken, setNextPageToken] = useState(null);
    const observer = useRef();
    const lastVideoElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && nextPageToken) {
                fetchMoreVideos();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, nextPageToken]);

    const API_KEY = import.meta.env.VITE_VIDEO_API_KEY;

    useEffect(() => {
        async function fetchTrendingVideos() {
            if (!API_KEY) {
                setError('Missing VITE_VIDEO_API_KEY. Add it to your .env and restart the dev server.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=10&key=${API_KEY}`);
                const data = await response.json();
                if (!Array.isArray(data.items)) {
                    throw new Error(data.error?.message || 'YouTube API returned no items.');
                }

                const formattedVideos = data.items.map(video => ({
                    id: video.id,
                    title: video.snippet.title,
                    thumbnail: video.snippet.thumbnails.high.url,
                    channelTitle: video.snippet.channelTitle,
                    viewCount: video.statistics?.viewCount,
                }));
                setVideos(formattedVideos);
                setNextPageToken(data.nextPageToken || null);
                setError(null);
            } catch (error) {
                console.error('Error fetching trending videos:', error);
                setError(error.message || 'Failed to fetch trending videos.');
            }
            finally {
                setLoading(false);
            }
        }

        fetchTrendingVideos()
    }, [API_KEY])

    async function fetchMoreVideos() {  
        if (!nextPageToken || !API_KEY) return;
        setLoading(true);
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=10&pageToken=${nextPageToken}&key=${API_KEY}`);
            const data = await response.json();
            if (!Array.isArray(data.items)) {
                throw new Error(data.error?.message || 'YouTube API returned no items.');
            }

            const formattedVideos = data.items.map(video => ({
                id: video.id,
                title: video.snippet.title,
                thumbnail: video.snippet.thumbnails.high.url,
                channelTitle: video.snippet.channelTitle,
                viewCount: video.statistics?.viewCount,
            }));
            setVideos(prevVideos => mergeUniqueVideos(formattedVideos, prevVideos));
            setNextPageToken(data.nextPageToken || null);
            setError(null);
        } catch (error) {
            console.error('Error fetching more videos:', error);
            setError(error.message || 'Failed to fetch more videos.');
        }
        finally {
            setLoading(false);
        }

        }

        

    return (
        <>
            <h1 className="text-3xl font-bold">Trending Videos</h1>
            {error && (
                <div className="mt-4 rounded border border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
                {videos.map((video, index) => {
                    if (index === videos.length - 1) {
                        return <VideoCard ref={lastVideoElementRef} key={video.id} video={video} />
                    } else {
                        return <VideoCard key={video.id} video={video} />
                    }
                })}
            </div>
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <ShimmerCard key={index} />
                    ))}
                </div>
            )}
        </>
  )
}