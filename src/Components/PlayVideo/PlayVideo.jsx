import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
// import video1 from '../../assets/video.mp4';
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import jack from "../../assets/jack.png";
import user_profile from "../../assets/user_profile.jpg";
import { API_KEY, value_converter } from "../../data";
import moment from "moment";

const PlayVideo = ({ videoId }) => {
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);

  const fetchVideoData = async () => {
    const videoDetails_url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;

    try {
      const response = await fetch(videoDetails_url);
      const result = await response.json();
      setApiData(result.items[0]);
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  const fetchChannelData = async () => {
    if (apiData && apiData.snippet && apiData.snippet.channelId) {
      const channelData_url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;

      try {
        const resp = await fetch(channelData_url);
        const res = await resp.json();
        setChannelData(res.items[0]);
      } catch (error) {
        console.error("Error fetching channel data:", error);
      }
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    fetchChannelData();
  }, [apiData]);

  return (
    <>
      <div className="play-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        <h3>{apiData ? apiData.snippet.title : "Title here"}</h3>
        <div className="play-video-info">
          <p>
            {apiData ? value_converter(apiData.statistics.viewCount) : "16K"} Views &bull;{" "}
            {apiData ? `${moment(apiData.snippet.publishedAt).fromNow()}` : "18 hours ago"}
          </p>
          <div>
            <span>
              <img src={like} alt="like" />
              {apiData ? value_converter(apiData.statistics.likeCount) : "125"}
            </span>
            <span>
              <img src={dislike} alt="dislike" />
            </span>
            <span>
              <img src={share} alt="share" />
              Share
            </span>
            <span>
              <img src={save} alt="save" />
              Save
            </span>
          </div>
        </div>
        <hr />
        <div className="publisher">
          <img src={channelData ? channelData.snippet.thumbnails.default.url : jack} alt="channel" />
          <div>
            <p>{channelData ? channelData.snippet.title : "GreatStack"}</p>
            <span>
              {channelData
                ? `${value_converter(channelData.statistics.subscriberCount)} Subscribers`
                : "1M Subscribers"}
            </span>
          </div>
          <button>Subscribe</button>
        </div>
        <div className="vid-description">
          <p>{apiData ? apiData.snippet.description : "Description Here"}</p>
          <hr />
          <h4>
            {apiData ? value_converter(apiData.statistics.commentCount) : "130"} Comments
          </h4>
          <div className="comment">
            <img src={user_profile} alt="user_profile" />
            <div>
              <h3>
                Jack Nicholson <span>1 day ago</span>
              </h3>
              <p>
                A global computer network providing a variety of information and connections using standardized communication protocols.
              </p>
              <div className="comment-action">
                <img src={like} alt="like" />
                <span>244</span>
                <img src={dislike} alt="dislike" />
              </div>
            </div>
          </div>
          {/* Repeat the comment block for more comments */}
        </div>
      </div>
    </>
  );
};

export default PlayVideo;

