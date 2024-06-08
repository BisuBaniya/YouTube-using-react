import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
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
  const [commentData, setCommentData] = useState(null);

  // Fetch video details
  const fetchVideoData = async () => {
    const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;
    try {
      const response = await fetch(videoDetailsUrl);
      const result = await response.json();
      setApiData(result.items[0]);
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  // Fetch channel details
  const fetchChannelData = async () => {
    if (apiData && apiData.snippet && apiData.snippet.channelId) {
      const channelDataUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
      try {
        const response = await fetch(channelDataUrl);
        const result = await response.json();
        setChannelData(result.items[0]);
      } catch (error) {
        console.error("Error fetching channel data:", error);
      }
    }
  };

  // Fetch comment details
  const fetchCommentData = async () => {
    if (apiData && apiData.id) {
      const commentUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${apiData.id}&key=${API_KEY}`;
      try {
        const response = await fetch(commentUrl);
        const result = await response.json();
        setCommentData(result.items);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    fetchChannelData();
    fetchCommentData();
  }, [apiData]);

  return (
    <div className="play-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        title="Video Player"
      ></iframe>
      <h3>{apiData?.snippet?.title || "Title here"}</h3>
      <div className="play-video-info">
        <p>
          {apiData ? value_converter(apiData.statistics.viewCount) : "16K"}{" "}
          Views &bull;{" "}
          {apiData
            ? moment(apiData.snippet.publishedAt).fromNow()
            : "18 hours ago"}
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
        <img
          src={channelData?.snippet?.thumbnails?.default?.url || jack}
          alt="channel"
        />
        <div>
          <p>{channelData?.snippet?.title || "GreatStack"}</p>
          <span>
            {channelData
              ? `${value_converter(
                  channelData.statistics.subscriberCount
                )} Subscribers`
              : "1M Subscribers"}
          </span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>{apiData?.snippet?.description || "Description Here"}</p>
        <hr />
        <h4>
          {apiData ? value_converter(apiData.statistics.commentCount) : "130"}{" "}
          Comments
        </h4>
        {commentData?.map((comment, index) => {
          const topLevelComment = comment.snippet.topLevelComment.snippet;
          return (
            <div key={comment.id} className="comment">
              <img
                src={topLevelComment.authorProfileImageUrl || user_profile}
                alt="user_profile"
              />
              <div>
                <h3>
                  {topLevelComment.authorDisplayName}{" "}
                  <span>{moment(topLevelComment.publishedAt).fromNow()}</span>
                </h3>
                <p>{topLevelComment.textDisplay}</p>
                <div className="comment-action">
                  <img src={like} alt="like" />
                  <span>{topLevelComment.likeCount}</span>
                  <img src={dislike} alt="dislike" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayVideo;
