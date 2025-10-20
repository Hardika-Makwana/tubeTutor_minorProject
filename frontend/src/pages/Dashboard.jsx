import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [checkpoints, setCheckpoints] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://127.0.0.1:8000/videos", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setVideos(res.data))
      .catch(err => console.error(err));
  }, []);

  const fetchCheckpoints = (video) => {
    const token = localStorage.getItem("token");
    axios.get(`http://127.0.0.1:8000/transcript/${video.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCheckpoints(res.data.text.split("\n").map((t,i)=>({index:i,text:t})));
        setSelectedVideo(video.title);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="dashboard-container">
      <h1 style={{color:"#7c3aed"}}>Tube Tutor Dashboard</h1>
      <div className="dashboard-card">
        <h2>Videos</h2>
        <ul className="video-list">
          {videos.map(v => (
            <li key={v.id} onClick={()=>fetchCheckpoints(v)}>{v.title}</li>
          ))}
        </ul>
        {selectedVideo && (
          <div className="checkpoints">
            <h3>Checkpoints for {selectedVideo}:</h3>
            <ul>
              {checkpoints.map(c => <li key={c.index}>{c.text}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}






