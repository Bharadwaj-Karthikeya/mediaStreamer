import ShimmerCard from "../components/Shimmer";
import VideoCard from "../components/VideoCard";

import { useState } from "react";

export default function Home(){
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchTrendingVideos() {
        try {
            const API_KEY = import.meta.env.VITE_VIDEO_API_KEY;
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=10&key=${API_KEY}`);
            
            const data = await response.json();

            console.log("Data recieved: ", data) 
            const formattedVideos = data.items.map(video => ({
                id: video.id,
                title: video.snippet.title,
                thumbnail: video.snippet.thumbnails.high.url,
                channelTitle: video.snippet.channelTitle,
                viewCount: video.snippet.viewCount,
            }));
            console.log(formattedVideos)
            setVideos(formattedVideos);
            setLoading(false);

        } catch (error) {
            console.error('Error fetching trending videos:', error);
        }
    }

    fetchTrendingVideos()

    return (
        <>
            <h1 className="text-3xl font-bold">Trending Videos</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
                {loading
                    ? Array(10).fill(0).map((_,i) => (
                        <ShimmerCard key={i} />
                    ))
                    : videos.map(video => (
                        <VideoCard key={video.id} video={video} />
                    ))
                }

            </div>

        </>
    )
}