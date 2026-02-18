import { useParams } from "react-router-dom";

export default function Watch() {
    const {id} = useParams();
    console.log("Video ID: ", id)
    const videoUrl = `https://www.youtube.com/embed/${id}`;

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-4xl aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <iframe
                    src= {videoUrl}
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                ></iframe>
            </div>
        </div>
    )
}