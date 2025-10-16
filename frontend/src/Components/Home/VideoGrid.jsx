import { useState, useRef } from "react";
import yoga from "../../assets/yoga.png";
import running from "../../assets/running.png";
import compression from "../../assets/compression.png";
import gloves from "../../assets/gloves.png";
import p1 from '../../assets/p1.png';
import p2 from '../../assets/p2.png';

const videos = [
  {
    id: 1,
    thumbnail: yoga,
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "/shop/video1"
  },
  {
    id: 2,
    thumbnail: running,
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "/shop/video2"
  },
  {
    id: 3,
    thumbnail: compression,
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "/shop/video3"
  },
  {
    id: 4,
    thumbnail: gloves,
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "/shop/video4"
  },
  {
    id: 5,
    thumbnail: p1,
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "/shop/video5"
  },
  {
    id: 6,
    thumbnail: p2,
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "/shop/video6"
  },
];

const VideoGrid = () => {
  return (
    <section className="w-full mx-auto py-10 grid grid-cols-1 md:grid-cols-2 gap-6 px-2 lg:px-4 ">
      {videos.map((item) => (
        <HoverVideoCard key={item.id} item={item} />
      ))}
    </section>
  );
};

const HoverVideoCard = ({ item }) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    videoRef.current?.pause();
    videoRef.current.currentTime = 0;
  };

  return (
    <div
      className="relative w-full h-[200px] sm:[300px] lg:h-[450px]  bg-black cursor-pointer overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail */}
      <img
        src={item.thumbnail}
        alt="Thumbnail"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"}`}
      />

      {/* Video */}
      <video
        ref={videoRef}
        src={item.video}
        muted
        loop
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
      />

      {/* Shop Now Button */}
      <a
        href={item.link}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all"
      >
        Shop Now
      </a>
    </div>
  );
};

export default VideoGrid;
