import { useNavigate, useSearchParams } from "react-router-dom";
import ShimmerCard from "../components/Shimmer.jsx";
import VideoCard from "../components/VideoCard.jsx";
import { useState, useEffect } from "react";
import { Pagination } from "../components/Pagination.jsx";

const HomePages = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams("");

    const page = Number(searchParams.get("page")) || 1;
    const [nextPageToken, setNextPageToken] = useState(null);

    const [tokens, setTokens] = useState([])

    useEffect(() => {
        async function fetchVideos() {
            try {
                const API_KEY = import.meta.env.VITE_VIDEO_API_KEY;
                const currentPageToken = tokens[page - 1] || "";
                const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=10&pageToken=${currentPageToken}&key=${API_KEY}`);
                
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
                setNextPageToken(data.nextPageToken || null);
                if(data.nextPageToken && !tokens[page]) {
                    setTokens(prevTokens => [...prevTokens, data.nextPageToken]);
                }
            } catch (error) {
                console.error('Error fetching trending videos:', error);
            }
            finally {
                setLoading(false);
            }
        }

        fetchVideos()
    }, [page, tokens])

    useEffect(() => {
        window.scrollTo({top: 0, behavior: "smooth"})
    }, [page])

    function handleNext(){
        if(nextPageToken) {
            navigate(`/?page=${page + 1}`);
        }
    }

    function handlePrev(){  
        if(page > 1) {
            navigate(`/?page=${page - 1}`);
        }
    }

    return (
        <div className="p-4">
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(10)].map((_, index) => (
                        <ShimmerCard key={index} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {videos.map(video => (
                        <VideoCard key={video.id} video={video} navigate={navigate} />
                    ))}
                </div>
            )}
            <div className="mt-4"></div>
            {!loading && videos.length > 0 && (
            <Pagination currentPage={page} 
            hasNextPage={!!nextPageToken} hasPrevPage={page > 1} 
            onNext={handleNext} onPrev={handlePrev} />
            )}
        </div>
        
    )
}

export default HomePages;