import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ShimmerCard from "../components/Shimmer";
import VideoCard from "../components/Videocard";

export default function Search() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const apiKey = "AIzaSyBscIgAQ99eDZh66pZEaWOKlVOmopK5G5A";

  useEffect(() => {
    let ignore = false;

    async function fetchTrendingVideos() {
      if (!query) {
        setVideos([]);
        setLoading(false);
        setError("");
        return;
      }

      if (!apiKey) {
        setError("Missing YouTube API key. Please define VITE_YOUTUBE_API_KEY in your .env file.");
        setVideos([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&key=${apiKey}`,
        );

        if (!response.ok) {
          const { error: apiError } = await response.json().catch(() => ({ error: {} }));
          const reason = apiError?.errors?.[0]?.reason || apiError?.message || "Unknown error";
          throw new Error(`Request failed (${response.status}): ${reason}`);
        }

        const data = await response.json();

        const formattedVideos = (data.items || [])
          .map((video) => ({
            id:
              video.id?.videoId ||
              video.id?.channelId ||
              video.id?.playlistId ||
              video.id,
            title: video.snippet?.title || "Untitled",
            thumbnail:
              video.snippet?.thumbnails?.high?.url ||
              video.snippet?.thumbnails?.medium?.url ||
              video.snippet?.thumbnails?.default?.url,
            channelTitle: video.snippet?.channelTitle || "Unknown channel",
          }))
          .filter((video) => Boolean(video.id && video.thumbnail));

        if (!ignore) {
          setVideos(formattedVideos);
        }
      } catch (error) {
        console.error("Error fetching trending videos:", error);
        if (!ignore) {
          setVideos([]);
          setError(error.message || "Failed to fetch videos");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchTrendingVideos();

    return () => {
      ignore = true;
    };
  }, [query, apiKey]);

  return (
    <>
      <h1 className="text-3xl font-bold">Search Results for "{query}"</h1>
      {error && (
        <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {loading
          ? Array(10)
              .fill(0)
              .map((_, i) => <ShimmerCard key={i} />)
          : videos.map((video) => <VideoCard key={video.id} video={video} />)}
      </div>
    </>
  );
}
