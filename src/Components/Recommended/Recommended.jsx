import React from 'react'
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom'
import { API_KEY,value_converter } from '../../data';
import './Recommended.css'
import thumbnail1 from '../../assets/thumbnail1.png'
import thumbnail2 from '../../assets/thumbnail2.png'
import thumbnail3 from '../../assets/thumbnail3.png'
import thumbnail4 from '../../assets/thumbnail4.png'
import thumbnail5 from '../../assets/thumbnail5.png'
import thumbnail6 from '../../assets/thumbnail6.png'
import thumbnail7 from '../../assets/thumbnail7.png'
import thumbnail8 from '../../assets/thumbnail8.png'


const Recommended = ({categoryId}) => {

  const [data, setData] = useState([]);

  const fetchData = async () => {
    const videoList_url = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=IN&videoCategoryId=${categoryId}&key=${API_KEY}`;
    
    try {
      const response = await fetch(videoList_url);
      const result = await response.json();
      setData(result.items);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  return (
    <>
    <div className="recommended">
    {data.map((item, index) => (
        <Link to={`/video/${item.snippet.categoryId}/${item.id}`} className="side-video-list">
        <img src={item.snippet.thumbnails.medium.url} alt="" />
        <div className='vid-info'>
        <h4>{item.snippet.title}</h4>
        <p>{item.snippet.channelTitle}</p>
        <p>{value_converter(item.statistics.viewCount)} Views</p>
        </div>
      </Link>
      ))}
      </div>
    </>
  )
}

export default Recommended

